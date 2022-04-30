import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IShareData {
    dishId: string;
}

@Component({
    selector: 'app-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss'],
})
export class ShareDialogComponent implements OnInit {
    url: string;

    constructor(public dialogRef: MatDialogRef<ShareDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: IShareData) {}

    ngOnInit(): void {
        this.url = `http://localhost:3000/dish/${this.data.dishId}`;
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.url);
        this.dialogRef.close();
    }

    shareViaWhatsApp() {
        const shareUrl = `whatsapp://send?text=${this.url}`;
        window.open(shareUrl, '_blank').focus();
        this.dialogRef.close();
    }
}
