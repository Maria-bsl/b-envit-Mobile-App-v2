import { Component, OnInit } from '@angular/core';
import { IonicSlides ,Platform} from '@ionic/angular';
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss'],
})
export class PricingPage implements OnInit {
  slideOpts = {
    initialSlide: 1,
    speed: 4000,
    loop: false,
    slidesPerView:1,
    autoplay: {
          delay: 1000,
          reverseDirection: false
    }
  };
  constructor() { }

  ngOnInit() {
  }

}
