import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FeatureFlagService } from 'src/app/services/featureFlag';

@Component({
  selector: 'app-flag',
  templateUrl: './flag.page.html',
  styleUrls: ['./flag.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class FlagPage implements OnInit {
  showSpecialButton = false;

  constructor(private featureFlag: FeatureFlagService) {}

  ngOnInit() {
    this.featureFlag.showSpecialButton$.subscribe(flag => {
      this.showSpecialButton = flag;
    });
  }
}