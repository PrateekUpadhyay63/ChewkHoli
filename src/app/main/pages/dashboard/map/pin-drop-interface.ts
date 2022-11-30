export interface pinDropData {
  latitude: string;
  longitude: string;
  color: string;
  message?: string;
  group_id: number;
  id?: string;
}

export const colorForPinDrop = {
  memberColor: "#ab47bc",
  ipCameraColor: "#43a047",
  vehicleColor: "#42a5f5",
};

export interface pinDropVar {
  addPinDrop?: boolean;
  movePinDrop?: boolean;
}
