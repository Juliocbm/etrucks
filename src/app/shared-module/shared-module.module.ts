import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import 'tslib'; // Importación explícita de tslib
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ImageCropperModule } from 'ngx-image-cropper';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

//componentes
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ModalImagenEditorComponent } from './components/modal-imagen-editor/modal-imagen-editor.component';
// import { ModalImagenPreviewComponent } from './components/modal-imagen-preview/modal-imagen-preview.component';

//pipes compartidos
import { EspaciadoPipe } from './pipes/espaciado.pipe';
import { OnlyDigitPipe } from './pipes/onlyDigit.pipe';
import { ValidarRfcPipe } from './pipes/validar-rfc.pipe';
import { ValidarCurpPipe } from './pipes/validar-curp.pipe';
import { ValidarInePipe } from './pipes/validar-ine.pipe';
import { DatePipe } from './pipes/date.pipe';

//Modal-Catalogos
import { CatalogoModalService } from './services/catalogo-modal.service';
import { CatalogoModalComponent } from './components/catalogo-modal/catalogo-modal.component';

import { PermissionsDirective } from './Directives/PermissionsDirective'; // Ajusta la ruta según tu estructura de directorios
import { FullTableComponent } from './components/full-table/full-table.component';
import { ColumnVisibilityModalComponent } from './components/column-visibility-modal/column-visibility-modal.component';

import { OnlyDigitDirective } from './Directives/OnlyDigit.directive';
import { OnlyDigitBaseDirective } from './Directives/OnlyDigitBase.directive';
import { MatSortModule } from '@angular/material/sort';
import { StringTruncatePipe } from './pipes/string-truncate.pipe';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedStepperComponent } from './components/shared-stepper/shared-stepper.component';
import { DialogCompartidoComponent } from './components/dialog-compartido/dialog-compartido.component';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Importa MatSnackBarModule
import { LoadingComponent } from './components/loading/loading.component';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';
import { CardHeaderComponent } from './components/card-header/card-header.component';
import { MatCardModule } from '@angular/material/card';
import { ModalHeaderComponent } from './components/modal-header/modal-header.component';
import { MatSelectModule } from '@angular/material/select';
import { MenuItemComponent } from './components/navbar/menu-item/menu-item.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReadOnlySelectorDirective } from './Directives/ReadOnlySelector.directive';

import { MatMenuModule } from '@angular/material/menu';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { ToUpperCaseDirective } from './Directives/ToUpperCase.directive';
import { DropdownFullComponent } from './components/dropdown-full/dropdown-full.component';
import { DropdownFullV2Component } from './components/dropdown-fullV2/dropdown-full.component';
import { DateTimeFormatDirective } from './Directives/DateTimeFormat.directive';
import { MaxLengthDirective } from './Directives/MaxLength.directive';
import { SingleFileUploadComponent } from './components/single-file-upload/single-file-upload.component';
import { DropdownMultiSelectComponent } from './components/dropdown-multi-select/dropdown-multi-select.component';
import { MatChipsModule } from '@angular/material/chips';
import { TipoDocumentoValidatorDirective } from './Directives/tipoDocumentoValidador.directive';
import { ModalImagenPreviewComponent } from './components/modal-imagen-preview/modal-imagen-preview.component';

import { FullTableV2Component } from './components/full-tableV2/full-table.component';
import { FormatDatePipe } from './pipes/formatDate.pipe';
import { FormatNumberService } from './services/formatNumber.Service';
import { OnlyLettersDirective } from './Directives/OnlyLetters.directive';
import { OnlyDecimalDirective } from './Directives/OnlyDecimal.directive';
import { BloquearEdicionDirective } from './Directives/BloquearEdicion.directive';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ExportNotificationComponent } from './components/export-notification/export-notification.component';
import { ExportNotificationService } from './services/export-notification.service';

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    LayoutComponent,
    NavbarComponent,
    ToolbarComponent,
    ModalImagenEditorComponent,
    ModalImagenPreviewComponent,

    // Pipes
    EspaciadoPipe,
    OnlyDigitPipe,
    ValidarRfcPipe,
    ValidarCurpPipe,
    ValidarInePipe,
    DatePipe,
    FormatDatePipe,
    OnlyDecimalDirective,
    BloquearEdicionDirective,

    CatalogoModalComponent,
    PermissionsDirective,
    FullTableComponent,
    ColumnVisibilityModalComponent,
    CustomSnackbarComponent,
    LoadingComponent,
    CardHeaderComponent,
    ModalHeaderComponent,
    MenuItemComponent,
    SingleFileUploadComponent,

    StringTruncatePipe,
    ColumnVisibilityModalComponent,
    SharedStepperComponent,
    DialogCompartidoComponent,
    ToUpperCaseDirective,
    OnlyDigitDirective,
    OnlyDigitBaseDirective,
    OnlyLettersDirective,
    ReadOnlySelectorDirective,
    DropdownFullComponent,
    DropdownFullV2Component,
    DropdownMultiSelectComponent,

    TipoDocumentoValidatorDirective,
    DateTimeFormatDirective,
    MaxLengthDirective,
    ValidarRfcPipe,
    ValidarCurpPipe,
    ValidarInePipe,

    FullTableV2Component,
    ExportNotificationComponent,
  ],
  imports: [
    FormsModule,
    RouterModule,
    BrowserModule,
    AlertModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
    MatSnackBarModule,
    MatCardModule,
    MatGridListModule,
    MatSelectModule,
    MatMenuModule,
    MatStepperModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatChipsModule,

    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    MatTabsModule,
    NgxSpinnerModule,
  ],
  exports: [
    // Pipes
    EspaciadoPipe,
    OnlyDigitPipe,
    ValidarRfcPipe,
    ValidarCurpPipe,
    ValidarInePipe,
    DatePipe,
    FormatDatePipe,
    StringTruncatePipe,

    ConfirmationModalComponent,
    LayoutComponent,
    ToolbarComponent,
    NavbarComponent,
    AlertModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ModalModule,
    BsDropdownModule,
    FullTableComponent,
    MatIconModule,
    LoadingComponent,
    MatCardModule,
    MatGridListModule,
    ModalHeaderComponent,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    BsDatepickerModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    CatalogoModalComponent,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatStepperModule,
    MatAutocompleteModule,

    SharedStepperComponent,
    DragDropModule,
    MatTabsModule,
    ToUpperCaseDirective,
    DropdownFullComponent,
    DropdownFullV2Component,
    DropdownMultiSelectComponent,

    TipoDocumentoValidatorDirective,
    OnlyDecimalDirective,
    BloquearEdicionDirective,
    DateTimeFormatDirective,
    OnlyDigitDirective,
    MaxLengthDirective,
    OnlyLettersDirective,
    OnlyDigitBaseDirective,
    ImageCropperModule,
    SingleFileUploadComponent,
    ModalImagenEditorComponent,
    ModalImagenPreviewComponent,
    MatListModule,
    FullTableV2Component,
    NgxSpinnerModule,
    ExportNotificationComponent,
  ],
  providers: [CatalogoModalService, ExportNotificationService, FormatNumberService],
})
export class SharedModuleModule {}
