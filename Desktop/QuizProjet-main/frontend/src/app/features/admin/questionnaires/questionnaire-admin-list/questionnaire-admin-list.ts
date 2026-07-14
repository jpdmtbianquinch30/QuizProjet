import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireAdminService, Questionnaire } from '../../../../core/services/questionnaire-admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-questionnaire-admin-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questionnaire-admin-list.html',
  styleUrls: ['./questionnaire-admin-list.scss']
})
export class QuestionnaireAdminListComponent implements OnInit {

  questionnaires: Questionnaire[] = [];
  selectedStatut = 'TOUS';
  searchTheme = '';

  constructor(private service: QuestionnaireAdminService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.service.getAll().subscribe(data => {
      this.questionnaires = data;
    });
  }

  filterByStatut() {
    if (this.selectedStatut === 'TOUS') {
      this.loadAll();
    } else {
      this.service.getByStatut(this.selectedStatut)
        .subscribe(data => this.questionnaires = data);
    }
  }

  search() {
    if (this.searchTheme.trim() === '') {
      this.loadAll();
    } else {
      this.service.searchByTheme(this.searchTheme)
        .subscribe(data => this.questionnaires = data);
    }
  }

  archiver(id: number) {
    this.service.archiver(id).subscribe(() => this.loadAll());
  }

  voir(id: number) {
    alert('Ouverture lecture seule du questionnaire ID = ' + id);
  }
}