import { Component, ViewChild, Signal, AfterViewInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { merge, Subject, switchMap, filter, map, startWith, tap, delay, catchError } from 'rxjs';
import { Operation } from 'app/core/api';
import { UowService, TypeForm } from 'app/core/http-services/uow.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';


import { Router, ActivatedRoute, RouterLink } from '@angular/router';



@Component({
    standalone: true,
    selector: 'app-operation',
    templateUrl: './operation.component.html',
    styles: [``],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FuseAlertComponent,
        MatPaginatorModule,
        FormsModule,
        ReactiveFormsModule,
        MatSortModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatProgressSpinnerModule,


        RouterLink,
    ],
})
export class OperationComponent implements AfterViewInit {
    //DI
    readonly uow = inject(UowService);
    readonly router = inject(Router);
    readonly route = inject(ActivatedRoute);


    @ViewChild(MatPaginator, { static: true })
    readonly paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    readonly sort: MatSort;

    readonly update = new Subject<number>();

    public isLoadingResults = true;
    public totalRecords = 0;

    readonly showMessage$ = new Subject<any>();

    readonly delete$ = new Subject<Operation>();
    readonly #delete$ = this.delete$.pipe(
        switchMap(item => this.uow.fuseConfirmation.open({ message: 'Operation' }).afterClosed().pipe(
            filter((e: 'confirmed' | 'cancelled') => e === 'confirmed'),
            tap(e => console.warn(e)),
            switchMap(_ => this.uow.core.operations.delete(item.id).pipe(
                catchError(this.uow.handleError),
                map((e: any) => ({ code: e.code < 0 ? -1 : 1, message: e.code < 0 ? e.message : 'Enregistrement réussi' })),
                tap(r => this.showMessage$.next({ message: r.message, code: r.code })),
            )),
        )),
    );

    // select
    readonly accounts$ = this.uow.core.accounts.getForSelect$;
    readonly accountDists$ = this.uow.core.accounts.getForSelect$;

    readonly operationType = new FormControl('');
    readonly accountId = new FormControl(0);
    readonly accountDistId = new FormControl(0);

    readonly viewInitDone = new Subject<void>();
    readonly dataSource: Signal<(Operation)[]> = toSignal(this.viewInitDone.pipe(
        delay(50),
        switchMap(_ => merge(
            this.sort.sortChange,
            this.paginator.page,
            this.update,
            this.#delete$,
        )),
        startWith(null as any),
        map(_ => [
            (this.paginator?.pageIndex || 0),
            this.paginator?.pageSize ?? 10,
            this.sort?.active ? this.sort?.active : 'id',
            this.sort?.direction ? this.sort?.direction : 'desc',
            this.operationType.value === '' ? '*' : this.operationType.value,
            this.accountId.value,
            this.accountDistId.value,
        ]),
        tap(e => this.isLoadingResults = true),
        switchMap(e => this.uow.core.operations.getList(e).pipe(
            tap(e => this.totalRecords = e.count),
            map(e => e.list))
        ),
        tap(e => this.isLoadingResults = false),
    ), { initialValue: [] }) as any;

    ngAfterViewInit(): void {
        this.viewInitDone.next();
    }

    trackById(index: number, item: any): number {
        return item.id; // Assuming "id" is a unique identifier for each item
    }

    reset() {
        this.operationType.setValue('');
        this.accountId.setValue(0);
        this.accountDistId.setValue(0);

        this.update.next(0);
    }

    search() {
        this.update.next(0);
    }


    add() {
        this.router.navigate(['/admin/operation', 0]);
    }

    edit(o: Operation) {
        this.router.navigate(['/admin/operation', o.id]);
    }

    remove(o: Operation) {
        this.delete$.next(o);
    }


}