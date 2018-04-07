import { Component, OnInit } from '@angular/core';
import { ClaimDataService } from './../../services/claims.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {

  proposalClaimData: any[];
  proposalMemberCount: any[];

  constructor(private claimDataService: ClaimDataService) { }

  ngOnInit() {
    this.fetchBenchmarkClaimAndMemberCount();
  }

  fetchBenchmarkClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkClaimsDataTotalMemberCount()
      .subscribe(
        data => {
          this.proposalClaimData = data[0];
          this.proposalMemberCount = data[1];
        }
      );
  }


}
