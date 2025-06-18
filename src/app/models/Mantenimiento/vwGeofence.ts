export class VwGeofence {
    id: string;
    idGeofence: number | null;
    nameGeo: string | null;
    createdTime: Date | null;
    addressGeo: string | null;
    points: string | null;
    latitudeGeo: number | null;
    longitudeGeo: number | null;
    addressType: string | null;
    idTag: string;
    nameTag: string;
    entryDate: Date | null;
    lastUpdate: Date | null;
    idProcess: number | null;
  
    constructor(
      id: string = '00000000-0000-0000-0000-000000000000',
      idGeofence: number | null = null,
      nameGeo: string | null = null,
      createdTime: Date | null = null,
      addressGeo: string | null = null,
      points: string | null = null,
      latitudeGeo: number | null = null,
      longitudeGeo: number | null = null,
      addressType: string | null = null,
      idTag: string = '',
      nameTag: string = '',
      entryDate: Date | null = null,
      lastUpdate: Date | null = null,
      idProcess: number | null = null
    ) {
      this.id = id;
      this.idGeofence = idGeofence;
      this.nameGeo = nameGeo;
      this.createdTime = createdTime;
      this.addressGeo = addressGeo;
      this.points = points;
      this.latitudeGeo = latitudeGeo;
      this.longitudeGeo = longitudeGeo;
      this.addressType = addressType;
      this.idTag = idTag;
      this.nameTag = nameTag;
      this.entryDate = entryDate;
      this.lastUpdate = lastUpdate;
      this.idProcess = idProcess;
    }
  }
  