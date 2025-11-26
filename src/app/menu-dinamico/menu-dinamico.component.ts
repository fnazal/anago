import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { environment } from '../../environments/environment';

interface MenuItem {
  categoria: 'entradas' | 'fondo' | 'ramen';
  nombre: string;
  descripcion: string;
  precio: number;
  veggie: boolean;
}

@Component({
  selector: 'app-menu-dinamico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-dinamico.component.html',
  styleUrls: ['./menu-dinamico.component.css']
})
export class MenuDinamicoComponent implements OnInit, OnChanges {

  @Input() selectedCategory!: 'entradas' | 'fondo' | 'ramen';
  @Input() isVeggie!: boolean;
  @Input() fadingItemIndices: Set<number> = new Set();

  data: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  loading: boolean = true;

  shouldFadeItem(index: number): boolean {
    return this.fadingItemIndices?.has(index) ?? false;
  }

  ngOnChanges() {
    this.filtrar();
  }

  async ngOnInit() {
    this.loading = true;
    const url = environment.googleDrive.menuUrl;

    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer);

    const allItems: MenuItem[] = [];

    // Se recorren todas las hojas
    for (const sheetNameOriginal of workbook.SheetNames) {
      const sheetNameLower = sheetNameOriginal.toLowerCase();
      let categoria: 'entradas' | 'fondo' | 'ramen';

      if (sheetNameLower.includes('entrada')) categoria = 'entradas';
      else if (sheetNameLower.includes('fondo')) categoria = 'fondo';
      else if (sheetNameLower.includes('ramen')) categoria = 'ramen';
      else continue;

      const sheet = workbook.Sheets[sheetNameOriginal];

      // Se pasan los datos, saltando los encabezados
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      // Se filtran las filas vacías
      const dataRows = rows.slice(1).filter(row => row[0] || row[1] || row[2] || row[3]);

      const mappedItems: MenuItem[] = dataRows.map(row => ({
        categoria,
        nombre: row[0] ?? '',
        descripcion: row[1] ?? '',
        precio: Number(row[2] ?? 0),
        veggie: String(row[3] ?? '').toLowerCase() === 'sí' || String(row[3] ?? '').toLowerCase() === 'si'
      }));

      allItems.push(...mappedItems);
    }

    this.data = allItems;
    this.filtrar();
    this.loading = false;
  }

  filtrar() {
    if (!this.selectedCategory) return;

    this.filteredItems = this.data.filter(item =>
      item.categoria === this.selectedCategory &&
      (this.isVeggie ? item.veggie : !item.veggie)
    );
  }
}
