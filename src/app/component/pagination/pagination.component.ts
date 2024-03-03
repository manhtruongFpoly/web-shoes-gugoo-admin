import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from "@angular/core";
import { CommonServiceService } from "src/app/utils/common-service.service";

@Component({
	selector: "app-pagination",
	templateUrl: "./pagination.component.html",
	styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit, OnChanges {
	@Input() total: number;
	@Input() totalPage: number;
	@Input() dataLength: number;
	@Input() pageSize: number;
	@Input() currentPage: number;
	@Input() collapse: boolean = false;

	@Output() paginate: EventEmitter<number> = new EventEmitter(false);

	public rangeWithDots: number[];
	public first: number = 0;
	public last: number = 0;

	constructor(private commonService: CommonServiceService) { }

	public ngOnInit(): void {
		this.pageSize = this.pageSize ?? 10;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.rangeWithDots = this.commonService.pagination(
			this.currentPage,
			this.totalPage,
      this.collapse
		);
		this.first = this.pageSize * (this.currentPage - 1) + 1;
		this.last = this.dataLength + this.pageSize * (this.currentPage - 1);
	}

	public prev(): void {
		this.currentPage--;
		if (this.currentPage < 1) {
			this.currentPage = 1;
			return;
		}
		this.page(this.currentPage);
	}

	public next(): void {
		this.currentPage++;
		if (this.currentPage > this.totalPage) {
			this.currentPage = this.totalPage;
			return;
		}

		this.page(this.currentPage);
	}

	public page(page: number): void {
		this.currentPage = page;
		this.paginate.next(this.currentPage);
	}
}
