export interface StageRowState {
  inputQty: string;
  productionQty: string;
  rejectionQty: string;
  location: string;
}

export const emptyRowState = (defaultLocation = ''): StageRowState => ({
  inputQty: '',
  productionQty: '',
  rejectionQty: '',
  location: defaultLocation,
});

export interface FlatStageRow {
  brandId: string;
  brandName: string;
  itemId: string;
  itemName: string;
  currentStock: number;
}
