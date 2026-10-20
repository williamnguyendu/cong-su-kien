const SPREADSHEET_ID = '1xlGdKp9WZY2J6WcUvkfYrx1GTJHvrdrLvzeFmQPY86o';
const SHEET_EVENT_NAME = 'DangKySuKien'; // Đổi tên sheet này trên file của bạn cho khớp
const SHEET_DATA_NAME = 'DSDKSuKien';

// Xử lý request GET từ Front-end để lấy thông tin sự kiện
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetEvent = ss.getSheetByName(SHEET_EVENT_NAME);
    const data = sheetEvent.getDataRange().getValues();
    const headers = data[0];
    
    let events = [];
    for (let i = 1; i < data.length; i++) {
      let row = data[i];
      if (row[headers.indexOf("TrangThai")] === "Mở đăng ký") {
        events.push({
          tenSuKien: row[headers.indexOf("TenSuKien")],
          ngayToChuc: row[headers.indexOf("NgayToChuc")],
          diaDiemToChuc: row[headers.indexOf("DiaDiemToChuc")],
          dangKyTu: row[headers.indexOf("DangKyTu")],
          dangKyDen: row[headers.indexOf("DangKyDen")],
          nganHang: row[headers.indexOf("NganHang")],
          soTaiKhoan: row[headers.indexOf("SoTaiKhoan")],
          chuTaiKhoan: row[headers.indexOf("ChuTaiKhoan")],
          noiDungChuyenKhoan: row[headers.indexOf("NoiDungChuyenKhoan")],
          phiThamGia: row[headers.indexOf("PhiThamGia")],
          phiBaoGom: row[headers.indexOf("PhiBaoGom")],
          phiKhongBaoGom: row[headers.indexOf("PhiKhongBaoGom")]
        });
      }
    }

    if (events.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Không có sự kiện mở đăng ký" })).setMimeType(ContentService.MimeType.JSON);
    }

    // Lọc sự kiện có NgayToChuc lớn nhất
    events.sort((a, b) => new Date(b.ngayToChuc).getTime() - new Date(a.ngayToChuc).getTime());
    const currentEvent = events[0];

    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: currentEvent })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Xử lý request POST để lưu data đăng ký
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetData = ss.getSheetByName(SHEET_DATA_NAME);
    
    const hoTen = e.parameter.hoTen;
    const sdt = e.parameter.sdt;
    const thoiGian = new Date();
    
    // Lưu vào sheet
    sheetData.appendRow([thoiGian, hoTen, sdt]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}