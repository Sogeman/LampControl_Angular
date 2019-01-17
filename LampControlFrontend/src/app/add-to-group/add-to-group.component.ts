import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HueService } from '../hue.service';
import { Light, Group } from '../detail/detail.component';
import { ManipulationService } from '../manipulation.service';

@Component({
  selector: 'app-add-to-group',
  templateUrl: './add-to-group.component.html',
  styleUrls: ['./add-to-group.component.css']
})
export class AddToGroupComponent implements OnInit {

  @Output() back = new EventEmitter();
  @Output() delete = new EventEmitter<number>();
  @Output() createGroup = new EventEmitter();
  @Output() saveGroup = new EventEmitter();
  @Input() selectedGroup: Group;
  @Input() isGroupCreation: boolean;
  @Input() id: number;
  lightList: Light[];
  selectedRoomClass: string;
  selectedLights: Array<any> = [];
  groupName: string;
  isListEmpty: boolean;
  helpText: string;

  constructor(private hueService: HueService, private manipulationService: ManipulationService) { }

  ngOnInit() {
    this.retrieveUnusedLights();
    this.retrieveLightsInGroup();
  }

  backButtonClicked() {
    this.back.emit();
  }

  deleteButtonClicked() {
    this.delete.emit(this.id);
  }

  onLightSelection(id: number, isChecked: boolean) {
    if (isChecked) {
      this.selectedLights.push(id);
    } else {
      const index = this.selectedLights.indexOf(id);
      this.selectedLights.splice(index, 1);
    }
  }

  retrieveUnusedLights() {
    let lights: Light[];
    this.hueService.retrieveAllLights()
    .then(response => lights = response)
    .then(() => this.filterUsedLights(lights)) // filter out lights already in a group
    .then(filteredIds => this.retrieveFilteredLights(filteredIds))
    .then(lightObjects => this.lightList = lightObjects)
    .then(() => {
      if (this.isListEmpty === true) {
        this.helpText = 'Keine Lichter mehr frei. Bitte entferne zuerst Lichter aus anderen Räumen.';
      } else {
        this.helpText = '';
      }
    });
  }

  filterUsedLights(lights: Light[]): Promise<number[]> {
    let filtered: number[];
    let lightsInGroups: number[];
    let lightIds: number[];
    return this.hueService.retrieveAllGroups()
      .then(responseGroups => lightsInGroups = this.filterLightsOutOfGroups(responseGroups))
      .then(() => lightIds = this.stripIdsFromLightlist(lights))
      .then(() => filtered = lightIds.filter(lightId => !lightsInGroups.includes(lightId)));
  }

  filterLightsOutOfGroups(groups: Group[]): number[] {
    let lights = [];
    for (const key in groups) {
      if (groups.hasOwnProperty(key)) {
        lights.push(groups[key].lights);
      }
    }
    lights = [].concat.apply([], lights);
    return lights;
  }

  retrieveFilteredLights(lightIds: number[]): Light[] {
    const lightObjects = new Array();
    if (lightIds.length === 0) {
      this.isListEmpty = true;
    } else {
      this.isListEmpty = false;
    }
    lightIds.forEach(lightId => {
      this.hueService.retrieveSingleLight(lightId)
        .then(light => lightObjects[lightId] = light);
    });
    return lightObjects;
  }

  stripIdsFromLightlist(lights: Light[]): number[] {
    const lightIds = [];
    for (const key in lights) {
      if (lights.hasOwnProperty(key)) {
        lightIds.push(key);
      }
    }
    return lightIds;
  }

  retrieveLightsInGroup() {
    const lights = this.selectedGroup.lights;

  }

  startGroupCreation(name: string, lights: number[], roomClass: string) {
    this.createGroup.emit(this.manipulationService.createGroupAttributeBody(name, lights, roomClass));
  }

  startSavingGroup(name: string, lights: number[]) {
    this.saveGroup.emit(this.manipulationService.createGroupAttributeBody(name, lights, ''));
  }



}
