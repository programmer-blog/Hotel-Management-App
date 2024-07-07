import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HomeComponent],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent {
  reservationForm: FormGroup = new FormGroup({});
  constructor(private formBuilder: FormBuilder, 
    private reservationService: ReservationService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required]
    });

    let id = this.activateRoute.snapshot.paramMap.get('id');
    if(id) {
      let reservation = this.reservationService.getReservation(id);
      if(reservation){
        this.reservationForm.patchValue(reservation)
      }
    }
  }

  onSubmit() {
    if(this.reservationForm.valid) {
      let reservation: Reservation= this.reservationForm.value;

      let id = this.activateRoute.snapshot.paramMap.get('id');

      if(id) {
        this.reservationService.updateReservation(id, reservation);
      } else{
        this.reservationService.addReservation(reservation);
      }      
      this.router.navigate(['/list']);
    } 
  }
}
