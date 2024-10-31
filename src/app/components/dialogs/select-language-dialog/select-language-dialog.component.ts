import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-language-dialog',
  templateUrl: './select-language-dialog.component.html',
  styleUrls: ['./select-language-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class SelectLanguageDialogComponent implements OnInit {
  languageChange: EventEmitter<{ language: string }> = new EventEmitter<{
    language: string;
  }>();
  formGroup!: FormGroup;
  languages: { title: string; code: string }[] = [];
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<SelectLanguageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { language: string }
  ) {}
  private createFormGroup() {
    this.formGroup = this.fb.group({
      language: this.fb.control(this.data.language, [Validators.required]),
    });
  }
  ngOnInit() {
    this.createFormGroup();
    this.translate.get('navbar.selectLanguage.languages').subscribe({
      next: (languages) => {
        this.languages = languages;
      },
    });
  }
  changeLanguage() {
    this.languageChange.emit(this.formGroup.value);
  }
  get language() {
    return this.formGroup.get('language') as FormControl;
  }
}
