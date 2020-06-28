import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AcademicService } from 'src/app/services/academic.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnChanges {

  @Input('indexOfTab') indexOfTab;
  constructor(private _academicService: AcademicService, 
    private _loaderService: LoaderServiceService,
    private _userService: UserService) { }
  bShowRooms: boolean = true;
  bShowRoomForm: boolean = false;
  bShowRoomDetail: boolean = false;
  bShowEditRoom: boolean = false;

  newRoomForm: FormGroup;
  editRoomForm: FormGroup;

  campus_master: any[] = [];
  formBoundCampus: any[] = [];
  formBoundBuilding: any[] = [];
  formBoundFloor: any[] = [];
  rooms: any[] = [];
  isRoomNewCreated: boolean = false;
  isRoomEdited: boolean = false;
  selectedRoom: any;
  perm: any = {}
  ngOnInit() {
    this.perm = this._userService.get_permission();
  }

  ngOnChanges(change) {
    if (this.indexOfTab === 3) {
    //  console.log(this.indexOfTab);
      // console.log(change);
      this.get_rooms();
      if(this.perm.permission_academics >= 2) {
        this.initialize_newroomform();
        this.get_campus_master();
      }
    }
  }

  showNewRoomForm() {
    this.bShowRooms = false;
    this.bShowRoomForm = true;
    this.formBoundBuilding = [];
    this.formBoundFloor = [];
  }

  hideShowRoomForm() {
    this.bShowRooms = true;
    this.bShowRoomForm = false;
    if (this.isRoomNewCreated) {
      this.get_rooms();
    }
    this.isRoomNewCreated = false;
  }

  showRoomDetails(room) {
    console.log(room);
    this.selectedRoom = room;
    this.bShowRooms = false;
    this.bShowRoomForm = false;
    this.bShowRoomDetail = true;
  }

  hideRoomDetail() {
    this.bShowRooms = true;
    this.bShowRoomForm = false;
    this.bShowRoomDetail = false;
    if (this.isRoomEdited) {
      this.get_rooms();
    }
    this.isRoomEdited = false;
  }

  showEditRoom() {
    this.initialize_editroomform();
    this.bShowEditRoom = true;
    this.bShowRooms = false;
    this.bShowRoomForm = false;
    this.bShowRoomDetail = false;
  }

  hideEditRoom() {    
    this.bShowEditRoom = false;
    this.bShowRooms = false;
    this.bShowRoomForm = false;
    this.bShowRoomDetail = true;
  }



  initialize_newroomform() {
    this.newRoomForm = new FormGroup({
      campus: new FormControl(),
      building: new FormControl(),
      floor: new FormControl(),
      name: new FormControl(),
    });
  }

  initialize_editroomform() {
    

    this.formBoundBuilding = this.campus_master.filter(current => {
      return current.id_campus === this.selectedRoom.id_campus;
    }).filter((current, index, array) => {
      return index === array.findIndex(x => x.id_building === current.id_building && x.id_campus === current.id_campus)
    }).map(current => {
      return { id_building: current.id_building, building_name: current.building_name };
    });

    this.formBoundFloor = this.campus_master.filter(current => {
      return this.selectedRoom.id_campus === current.id_campus
        && this.selectedRoom.id_building === current.id_building;
    }).map(current => {
      return { id_floor: current.id_floor, floor_name: current.floor_name }
    });
    this.editRoomForm = new FormGroup({
      campus: new FormControl(this.selectedRoom.id_campus),
      building: new FormControl(this.selectedRoom.id_building),
      floor: new FormControl(this.selectedRoom.id_floor),
      name: new FormControl(this.selectedRoom.name),
    });

    
  }


  onChangeCapmus() {
    this.formBoundBuilding = [];
    this.formBoundFloor = [];
    this.newRoomForm.patchValue({ building: null, floor: null });
    this.formBoundBuilding = this.campus_master.filter(current => {
      return current.id_campus === this.newRoomForm.value.campus;
    })
      .filter((current, index, array) => {
        return index === array.findIndex(x => x.id_building === current.id_building && x.id_campus === current.id_campus)
      })
      .map(current => {
        return { id_building: current.id_building, building_name: current.building_name };
      })
  }

  onChangeBuilding() {
    this.formBoundFloor = [];
    this.newRoomForm.patchValue({ floor: null });
    this.formBoundFloor = this.campus_master.filter(current => {
      return this.newRoomForm.value.campus === current.id_campus
        && this.newRoomForm.value.building === current.id_building;
    }).map(current => {
      return { id_floor: current.id_floor, floor_name: current.floor_name }
    });
  }



  saveNewRoom() {
    console.log('save new room');
    console.log(this.newRoomForm.value);
    this._loaderService.show();
    this._academicService.create_room(this.newRoomForm.value).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.isRoomNewCreated = true;
        this.newRoomForm.reset();
        this.formBoundBuilding = [];
        this.formBoundFloor = [];

        alert('New Room created successfully!');
      } else {
        alert('Error while creating new room!');
        console.log(data.data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while creating new room!');
      console.log(err);
    })
  }

  editRoom() {
    console.log(this.editRoomForm.value);
    this._loaderService.show();
    this._academicService.update_room(this.selectedRoom.id_room, this.editRoomForm.value).subscribe((data: any) => {
      this._loaderService.hide();
      if(data.success) {
        this.isRoomEdited = true;
        alert('Room details updated successfully!');
        this.get_room(this.selectedRoom.id_room);
        this.hideEditRoom();
      } else {
        alert('Error while updating room details!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while updating room details!');
      console.log('Error while updating room details!');
      console.log(err);
    })
  }

  get_campus_master() {
    this._loaderService.show();
    this._academicService.get_campus_master().subscribe((data: any) => {
      if (data.success) {
        this._loaderService.hide();
        this.campus_master = data.data;

        this.formBoundCampus = this.campus_master.filter((current, index, array) => {
          return index === array.findIndex(x => {
            return x.id_campus === current.id_campus;
          });
        }).map(current => {
          return { id_campus: current.id_campus, campus_name: current.campus_name };
        });
        console.log(this.campus_master);
        console.log(this.formBoundCampus);

      } else {
        console.log('Error while fetching campus master data!');
        console.log(data);
      }
    }, (err) => {
      console.log('Error while fetching campus master data!');
      console.log(err);
    })
  }


  get_rooms() {
    this._loaderService.show();
    this._academicService.get_rooms().subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.rooms = data.data;
        console.log(this.rooms);
        
      } else {
        console.log('Error while fetching rooms!');
        console.log(data);
      }
    }, (err) => {
      console.log('Error while fetching rooms!');
      console.log(err);
    })
  }

  get_room(id) {
    this._loaderService.show();
    this._academicService.get_room(id).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.selectedRoom = data.data[0];
        console.log(this.selectedRoom);
      } else {
        console.log('Error while fetching room with id ' + id);
        console.log(data);
      }
    }, (err) => {
      console.log('Error while fetching room with id '+ id);
      console.log(err);
    })
  }

}
