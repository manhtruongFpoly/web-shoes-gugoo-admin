import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AgRendererComponent } from "ag-grid-angular";

@Component({
	selector: "kt-checkbox",
	templateUrl: "./checkbox.component.html",
	styleUrls: ["./checkbox.component.scss"],
})
export class CheckboxComponent implements AgRendererComponent {

	params: any;

	@Input() checkboxControl: FormControl;

	constructor(
	) { }

	agInit(params: any): void {
		this.params = params;
		console.log('this.params', this.params);
	}

	refresh(params: any): boolean {
		return true
	}

	onChangeCheckbox(params: any): void {
    console.log('da vao day',params);
		const data = params.data;


		if (this.params.onCheck) {
      console.log('da vao day');

      if (this.params.valueParams) {
        console.log('da vao day');
        this.params.valueParams(params);
      }

      console.log('this.params.data[this.params.colDef.type]', this.params.data[this.params.colDef.type]);
			this.params.onCheck(this.params.data[this.params.colDef.type]);
			return;
		}



		if (data.proctorKey) {
			this.params.context.formContext.get('zoomId').setValue(null);
			params.api.forEachNode((rowNode) => {
				if (rowNode.data.codeName != data.codeName) {
					rowNode.data.proctorKey = false;
				}
			})
		}
	}

	onChangeHeader(): void {
	  console.log('this.params',this.params);
		this.params.onCheck(this.params.context.checkboxHeaderValue);
	}

	onClick(event): void {
    console.log(this.params);
		if (this.params.isTickOnce && this.params.data[this.params.colDef?.type || this.params.column.colDef.type]) {
			event.preventDefault();
		}
	}
}
