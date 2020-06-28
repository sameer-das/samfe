import { NgModule } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatInputModule,
  MatTabsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatStepperModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatTableModule,
  MatDividerModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatRadioModule
} from "@angular/material";

const Material = [
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatInputModule,
  MatTabsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatStepperModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatTableModule,
  MatDividerModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatRadioModule
];

@NgModule({
  imports: [Material],
  exports: [Material],
  providers: []
})
export class MaterialModule {}
