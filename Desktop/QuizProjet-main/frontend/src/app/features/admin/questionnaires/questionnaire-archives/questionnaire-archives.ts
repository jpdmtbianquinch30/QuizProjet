import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireAdminService, Questionnaire } from '../../../../core/services/questionnaire-admin.service';

@Component({
  selector: 'app-questionnaire-archives',
  standalone: true,
  imports: [CommonModule],
templateUrl: './questionnaire-archives.html',
styleUrls: [
  './questionnaire-archives.scss'
]})
export class QuestionnaireArchivesComponent implements OnInit {

  archives: Questionnaire[] = [];

  constructor(private service: QuestionnaireAdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getArchives().subscribe((data: Questionnaire[]) => {
      this.archives = data;
    });
  }

  restaurer(id: number) {
    this.service.restaurer(id).subscribe(() => this.load());
  }
}