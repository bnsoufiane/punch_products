import {Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChange} from 'angular2/core';
import {PaginatePipe} from 'ng2-pagination';
import {IPaginationInstance} from 'ng2-pagination';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {ArrayUtils} from '../../../utils/array.utils';
import {Portfolio} from '../../interfaces/proposals/portfolio.interface';
import {PortfolioQueryFilterPipe} from '../../pipes/portfolio-query-filter';
import {CONFIG} from '../../config/config';

/**
 * Shows the confirmation modal dialog with yes or no option
 */
@Component({
    selector: 'ar-add-portfolio-modal',
    moduleId: module.id,
    templateUrl: 'add-portfolio-modal.component.html',
    styleUrls: ['../../../css/admin/assets/stylesheets/components/modal.css', '../../../css/admin/assets/stylesheets/components/list.css'],
    directives: [ListPaginationComponent, ListSearchComponent],
    pipes: [PaginatePipe, PortfolioQueryFilterPipe],
    encapsulation: ViewEncapsulation.None,
})
export class AddPortfolioModalComponent implements OnChanges {
    @Input() selectedSamples: Portfolio[] = [];
    @Input() showModal: boolean = false;
    @Input() positiveLabel: string = 'Add Portfolio Pieces';
    @Output() closed = new EventEmitter<boolean>();
    @Output() selectionFinished = new EventEmitter<Portfolio[]>();

    portfolioSamples: Portfolio[] = CONFIG.PORTFOLIO_SAMPLES;

    temporarySelection: Portfolio[] = [];
    currentPage: IPaginationInstance = {
        id: 'portfolioSamples',
        itemsPerPage: 6,
        currentPage: 1
    };

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            if (propName === 'showModal') {
                let prop = changes[propName];
                if (prop.currentValue === true) {
                    this.temporarySelection = this.selectedSamples.slice();
                }
                return;
            }
        }
    }

    toggleSelected(element: Portfolio) {
        if (this.temporarySelection.indexOf(element) !== -1) {
            ArrayUtils.remove(this.temporarySelection, element);
        } else {
            this.temporarySelection.push(element);
        }
    }

    isSelected(element: Portfolio): boolean {
        return (this.temporarySelection.indexOf(element) !== -1);
    }

    /**
     * Closes the modal with action confirmed
     * @returns {boolean}
     */
    positiveAction(): boolean {
        this.showModal = false;
        this.closed.emit(true);
        this.selectedSamples = this.temporarySelection.slice();
        this.selectionFinished.emit(this.selectedSamples);
        return false;
    }

    /**
     * Closes the modal with action canceled
     * @returns {boolean}
     */
    cancelAction(): boolean {
        this.showModal = false;
        this.closed.emit(false);
        return false;
    }
}
