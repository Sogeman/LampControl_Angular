
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HueService } from '../hue.service';
import { ManipulationService } from '../manipulation.service';
import { Group } from '../detail/detail.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  @Output() groupsRefreshed = new EventEmitter();
  groupList: Group[];
  selectedGroup: Group;
  id: number;
  addGroup: boolean;

  constructor(private hueService: HueService, private manipulationService: ManipulationService) { }

  ngOnInit() {
    if (localStorage.getItem('bridgeIp')) {
      this.hueService.retrieveAllGroups()
        .then(groups => this.groupList = groups)
        .then(() => console.log(this.groupList));
    }
  }

  getGroupImage(roomClass: string, state: string): string {
    return this.manipulationService.getClassImage(roomClass, state);
  }

  refreshSingle(id: number) {
    this.hueService.retrieveSingleGroup(id)
      .then(group => this.selectedGroup = group)
      .then(() => this.id = id);
  }

  refreshAllWithLights() {
    this.hueService.retrieveAllGroups()
      .then(groups => this.groupList = groups);
  }

  refreshAll() {
    this.hueService.retrieveAllGroups()
      .then(groups => this.groupList = groups);
    this.groupsRefreshed.emit();
  }

  toggleGroup(groupState: boolean, id: number) {
    this.hueService.toggleGroup(groupState, id)
      .then(() => this.refreshAll());
  }

  toggleGroupDetail(lightState: boolean, id: number) {
    this.hueService.toggleGroup(lightState, id)
      .then(() => this.refreshSingle(id));
  }

  viewSelectedGroup(id: number) {
    this.hueService.retrieveSingleGroup(id)
      .then(group => {
        if (group.lights.length < 1) {
          this.addGroup = true;
        } else {
          this.selectedGroup = group;
        }
        })
      .then(() => this.id = id);
  }

  clearSelectedGroup() {
    this.selectedGroup = null;
    this.refreshAll();
  }

  saveGroupName(value: string, id: number, type: string) {
    this.hueService.changeName(value, id, type)
      .then(() => this.refreshSingle(id));
  }

  changeState(state: string, id: number) {
    const changeState = this.manipulationService.calculateChangeLightState(state);
    this.hueService.updateState('groups', changeState.xy, changeState.bri, id)
      .then(() => this.refreshSingle(id));  // this would kill any server instantly if more people used it at once
                                            // polls server every movement
  }

  deleteSelectedGroup(id: number) {
    this.hueService.deleteEntity(id, 'groups')
      .then(() => this.clearSelectedGroup());
  }
}
