import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';

export interface ExportJob {
  id: string;
  fileName: string;
  progress: number;
  isCompleted: boolean;
  error: string | null;
  timestamp: number;
  progressAnimation?: Subscription | null;
}

export interface ExportStatus {
  isExporting: boolean;
  activeJobs: ExportJob[];
  showNotification: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExportNotificationService {
  private defaultStatus: ExportStatus = {
    isExporting: false,
    activeJobs: [],
    showNotification: false
  };

  private exportStatusSubject = new BehaviorSubject<ExportStatus>(this.defaultStatus);
  public exportStatus$: Observable<ExportStatus> = this.exportStatusSubject.asObservable();

  constructor() { }

  /**
   * Inicia una nueva exportación y retorna su ID
   */
  startExport(fileName: string): string {
    const jobId = this.generateJobId();
    const currentStatus = this.exportStatusSubject.value;
    
    const newJob: ExportJob = {
      id: jobId,
      fileName,
      progress: 0,
      isCompleted: false,
      error: null,
      timestamp: Date.now(),
      progressAnimation: null
    };
    
    // Añadir el nuevo trabajo a la lista de trabajos activos
    const updatedJobs = [...currentStatus.activeJobs, newJob];
    
    this.exportStatusSubject.next({
      isExporting: true,
      activeJobs: updatedJobs,
      showNotification: true
    });
    
    // Iniciar la animación de progreso hasta el 10%
    this.animateProgressTo(jobId, 0, 10, 800);
    
    return jobId;
  }

  /**
   * Actualiza el progreso de una exportación específica
   */
  updateProgress(jobId: string, targetProgress: number): void {
    const currentStatus = this.exportStatusSubject.value;
    const job = currentStatus.activeJobs.find(j => j.id === jobId);
    
    if (job) {
      // Detener cualquier animación previa
      this.stopAnimation(job);
      
      // Animar desde el progreso actual hasta el objetivo
      const currentProgress = job.progress;
      this.animateProgressTo(jobId, currentProgress, targetProgress, 1000);
    }
  }

  /**
   * Detiene de forma segura una animación
   */
  private stopAnimation(job: ExportJob): void {
    if (job && job.progressAnimation) {
      try {
        job.progressAnimation.unsubscribe();
        job.progressAnimation = null;
      } catch (error) {
        console.error('Error al detener animación:', error);
      }
    }
  }

  /**
   * Anima el progreso de una forma más realista
   */
  private animateProgressTo(jobId: string, fromProgress: number, toProgress: number, duration: number): void {
    // Obtener estado actual
    const currentStatus = this.exportStatusSubject.value;
    const jobIndex = currentStatus.activeJobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) return;
    
    const job = currentStatus.activeJobs[jobIndex];
    
    // Detener animación previa si existe
    this.stopAnimation(job);
    
    // Calcular cuántos pasos necesitamos
    const steps = Math.max(Math.ceil(duration / 50), 5); // Al menos 5 pasos
    const stepValue = (toProgress - fromProgress) / steps;
    
    // Crear una animación con interval
    const animation = interval(duration / steps).pipe(
      take(steps),
      map(step => fromProgress + stepValue * (step + 1))
    ).subscribe({
      next: (progress) => {
        // Obtener el estado actual
        const updatedStatus = this.exportStatusSubject.value;
        const currentJobIndex = updatedStatus.activeJobs.findIndex(j => j.id === jobId);
        
        if (currentJobIndex !== -1) {
          // Crear una copia de los trabajos
          const updatedJobs = [...updatedStatus.activeJobs];
          
          // Actualizar el progreso del trabajo específico
          updatedJobs[currentJobIndex] = {
            ...updatedJobs[currentJobIndex],
            progress: progress
          };
          
          // Actualizar el estado
          this.exportStatusSubject.next({
            ...updatedStatus,
            activeJobs: updatedJobs
          });
          
          // Limpiar la suscripción cuando llegamos al último paso
          if (progress >= toProgress - stepValue/2) {
            this.stopAnimation(updatedJobs[currentJobIndex]);
          }
        }
      },
      error: (err) => {
        console.error('Error en animación:', err);
      },
      complete: () => {
        // Completar la animación
      }
    });
    
    // Guardar la animación en el job
    const updatedJobs = [...currentStatus.activeJobs];
    updatedJobs[jobIndex] = {
      ...updatedJobs[jobIndex],
      progressAnimation: animation
    };
    
    this.exportStatusSubject.next({
      ...currentStatus,
      activeJobs: updatedJobs
    });
  }

  /**
   * Marca una exportación como completada
   */
  completeExport(jobId: string): void {
    const currentStatus = this.exportStatusSubject.value;
    const jobIndex = currentStatus.activeJobs.findIndex(j => j.id === jobId);
    
    if (jobIndex !== -1) {
      const job = currentStatus.activeJobs[jobIndex];
      
      // Detener cualquier animación en curso
      this.stopAnimation(job);
      
      // Animar al 100% para completar
      this.animateProgressTo(jobId, job.progress, 100, 500);
      
      // Actualizar el estado a completado
      const updatedJobs = currentStatus.activeJobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            isCompleted: true
          };
        }
        return job;
      });
      
      this.exportStatusSubject.next({
        ...currentStatus,
        activeJobs: updatedJobs,
        isExporting: updatedJobs.some(job => !job.isCompleted && !job.error)
      });
      
      // Programar la eliminación del trabajo completado después de cierto tiempo
      setTimeout(() => {
        this.removeJob(jobId);
      }, 5000);
    }
  }

  /**
   * Marca una exportación como fallida
   */
  errorExport(jobId: string, error: any): void {
    console.error('Error en la exportación:', error);
    
    const currentStatus = this.exportStatusSubject.value;
    const jobIndex = currentStatus.activeJobs.findIndex(j => j.id === jobId);
    
    if (jobIndex !== -1) {
      const job = currentStatus.activeJobs[jobIndex];
      
      // Detener cualquier animación en curso
      this.stopAnimation(job);
      
      const updatedJobs = currentStatus.activeJobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            error: error.message || 'Error al exportar',
            isCompleted: true
          };
        }
        return job;
      });
      
      this.exportStatusSubject.next({
        ...currentStatus,
        activeJobs: updatedJobs,
        isExporting: updatedJobs.some(job => !job.isCompleted && !job.error)
      });
      
      // Programar la eliminación del trabajo fallido después de cierto tiempo
      setTimeout(() => {
        this.removeJob(jobId);
      }, 5000);
    }
  }

  /**
   * Elimina un trabajo de la lista de trabajos activos
   */
  private removeJob(jobId: string): void {
    const currentStatus = this.exportStatusSubject.value;
    const jobIndex = currentStatus.activeJobs.findIndex(j => j.id === jobId);
    
    if (jobIndex !== -1) {
      const job = currentStatus.activeJobs[jobIndex];
      
      // Detener cualquier animación en curso
      this.stopAnimation(job);
      
      const updatedJobs = currentStatus.activeJobs.filter(job => job.id !== jobId);
      
      if (updatedJobs.length === 0) {
        // Si no hay más trabajos, ocultar la notificación
        this.exportStatusSubject.next({
          isExporting: false,
          activeJobs: [],
          showNotification: false
        });
      } else {
        // Si aún hay trabajos, actualizar la lista
        this.exportStatusSubject.next({
          ...currentStatus,
          activeJobs: updatedJobs,
          isExporting: updatedJobs.some(job => !job.isCompleted && !job.error)
        });
      }
    }
  }

  /**
   * Oculta la notificación manualmente
   */
  hideNotification(): void {
    const currentStatus = this.exportStatusSubject.value;
    
    // Detener todas las animaciones en curso
    currentStatus.activeJobs.forEach(job => {
      this.stopAnimation(job);
    });
    
    this.exportStatusSubject.next({
      ...currentStatus,
      showNotification: false
    });
  }

  /**
   * Muestra la notificación si estaba oculta
   */
  showNotification(): void {
    const currentStatus = this.exportStatusSubject.value;
    if (currentStatus.activeJobs.length > 0) {
      this.exportStatusSubject.next({
        ...currentStatus,
        showNotification: true
      });
    }
  }

  /**
   * Genera un ID único para cada trabajo
   */
  private generateJobId(): string {
    return 'export-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
} 