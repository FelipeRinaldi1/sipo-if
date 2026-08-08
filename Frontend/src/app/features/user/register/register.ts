import { Component,signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button'

@Component({
  selector: 'app-register',
  imports: [MatCardModule,MatFormFieldModule,MatInputModule,FormsModule,ReactiveFormsModule,MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

}
