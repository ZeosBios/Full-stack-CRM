import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from '../../../shared/services/positions.service';
import {Position} from "../../../shared/interfaces"
import { MaterialService, MaterialInstance } from '../../../shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  positions: Position[] = []
  loading = false
  modal: MaterialInstance
  form: FormGroup
  positionId = null
  constructor(private positionService: PositionsService) { 
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.loading = true
    this.positionService.fetch(this.categoryId).subscribe(
      positions => {
        this.positions = positions
        this.loading = false
      })
  }

  ngOnDestroy(){
    this.modal.destroy()
  }

  ngAfterViewInit(){
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position){
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  addOnPosition(){
    this.positionId = null
    this.form.reset({
      name: null,
      cost: 1
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onCancel() {
    this.modal.close()
  }

  onDeletePosition(event: Event, position: Position){
    event.stopPropagation()
    const decision = window.confirm("Delete position?")
    if (decision) {
      this.positionService.delete(position).subscribe(
        response => {
          const index = this.positions.findIndex(pos => pos._id === position._id)
          this.positions.splice(index, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onSubmit(){
    this.form.disable()
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const comleted = () => {
      this.modal.close()
      this.form.reset({name: null, cost: 1})
      this.form.enable()
    } 

    if (this.positionId){
      newPosition._id = this.positionId
      this.positionService.update(newPosition).subscribe(
        position => {
          const index = this.positions.findIndex(pos => pos._id === position._id)
          this.positions[index] = position
          MaterialService.toast('Save change')
        },
        error => MaterialService.toast(error.error.message),
        comleted
      )
    }else {
    this.positionService.create(newPosition).subscribe(
      position => {
        MaterialService.toast('Created position')
        this.positions.push(position)
      },
      error => MaterialService.toast(error.error.message),
      comleted
    )
  }
  }
}
