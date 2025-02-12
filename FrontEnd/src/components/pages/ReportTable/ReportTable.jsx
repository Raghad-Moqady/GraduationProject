import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CircularProgress, IconButton, Rating, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDialog from "../commonDialog/CommonDialog";
import StatisticsCard from "./statisticsCard/StatisticsCard";
import { Button } from "react-bootstrap";
 import ReplayIcon from '@mui/icons-material/Replay';
import EditAchaievement from "../../teacher/dialogPages/editAchaievement/EditAchaievement";
 //بضل نربط الحذف والتعديل مع الباك
//وذلك باستخدام context
//وبضل شغلة اضافة سكرول لما نصغر الشاشة ضروري

// Define an RTL theme
const theme = createTheme({
  direction: "rtl",
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#688860",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1rem",
        },
        body: {
          fontSize: "1rem",
        },
      },
    },
  },
});

export default function ReportTable({ columns, rows, reportStatistics ,role, DateFitlerFunction,ResetRowsFunction,deleteReport}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  console.log(reportStatistics);
  //for Details Dialog
  const [openDialog, setOpenDialog] = React.useState(false); // حالة للتحكم في فتح وإغلاق الـ Dialog
  const [details, setDetails] = React.useState("");
 
//for date errors
const [dateError, setDateError] = React.useState("");
   //range of date filter
    const [minDate, setMinDate] = React.useState("");
   const [maxDate, setMaxDate] = React.useState("");
   const [filterLoading,setFilterLoading]=React.useState(false);
   const [resetLoading,setResetLoading]=React.useState(false);
   const [isFiltered,setIsFiltered]=React.useState(false);
 
 //هاي بدنا نبعتها للكومبوننت كارد الاحصائيات
 //رح نصير نوخدها من الباك بعد ما نفلتر بناء على التاريخ 
 const statisticsContent = [
  { label: "عدد صفحات الحفظ", number: reportStatistics?.totalHifz },
  { label: "عدد صفحات المراجعة", number: reportStatistics?.totalReview },
  { label: "عدد صفحات التثبيت", number: reportStatistics?.totalTathbit },
];
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //for Details Dialog
  const openDetailsDialog = (notes) => {
    setDetails(notes);
    setOpenDialog(true); // فتح الـ Dialog
  };

  const closeDetailsDialog = () => {
    setOpenDialog(false); // إغلاق الـ Dialog
    setDetails("");
  };
  

  //for Filter Date 
    const onFilter = async() => {
      setFilterLoading(true);
         await DateFitlerFunction(minDate,maxDate);
         setFilterLoading(false);
         setIsFiltered(true);
    };

// for Delete Dialog
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =React.useState(false); // حالة للتحكم في فتح وإغلاق الـ Dialog
  const [reportId,setReportId]=React.useState(null);
  const [studentName,setStudentName]=React.useState(null);
  const openDeleteDialog = () => {
    setOpenConfirmDeleteDialog(true); // فتح الـ Dialog
  };

  const closeDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false); // إغلاق الـ Dialog
  };
  //فقط للمعلم
  //حذف تقرير
//1st
  const handelDeleteReport=(reportId)=>{
    setReportId(reportId);
    openDeleteDialog();
  }
 //2nd after dialog => actionFunction
  const DeleteReport=async()=>{
    //only from teacher
      await deleteReport(reportId);
  }
  /////
  //تعديل تقرير
  const [openEditDialog, setOpenEditDialog] =React.useState(false); // حالة للتحكم في فتح وإغلاق الـ Dialog
  const openEditReoprtDialog = () => {
    setOpenEditDialog(true); // فتح الـ Dialog
  };

  const closeEditReportDialog = () => {
    setOpenEditDialog(false); // إغلاق الـ Dialog
  };
  const handelEditReport=(reportId,studentName)=>{
    setReportId(reportId);
    setStudentName(studentName);
    openEditReoprtDialog();
  }
  //ResetRows
  const ResetRows = async() => {
    setResetLoading(true);
    await ResetRowsFunction();
    setResetLoading(false);
    setIsFiltered(false);//disabled
    setMaxDate("");
    setMinDate("");
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 2 }}> 
          {/* Date filters */}
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }} className="mt-3">
            <TextField
              label="من التاريخ:"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={minDate}
              onChange={(e) => {
                const selectedDate = e.target.value; 
                setMinDate(selectedDate);
             //اذا تم تحديد تاريخ النهاية بالاول ثم تحديد قيمة تاريخ البداية بحيث تكون اكبر من تاريخ النهاية ==اعادة ضبط
                if (maxDate && new Date(selectedDate) > new Date(maxDate)) {
                  setMaxDate("");
                }
              }} 
            />
            <TextField
              label="إلى التاريخ:"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={maxDate}
              onChange={(e) => {
                const selectedDate = e.target.value;

                // السماح فقط إذا كان تاريخ النهاية أكبر أو يساوي تاريخ البداية
                if (minDate && new Date(selectedDate) < new Date(minDate)) {
                  setDateError("لا يمكن أن يكون تاريخ النهاية أقل من تاريخ البداية");
                } else {
                  setDateError(""); // مسح الخطأ
                  setMaxDate(selectedDate);
                }
              }} 
              error={!!dateError} // يظهر الخطأ إذا كانت الرسالة موجودة
              helperText={dateError} // عرض رسالة الخطأ
            />
             <Button  
          onClick={()=>onFilter()}
          disabled={!minDate || !maxDate || dateError} // تعطيل الزر إذا لم يتم إدخال التواريخ
         >
          {filterLoading? <CircularProgress  color="inherit" size={20} />: <SearchIcon />}
        
        </Button>
        <Button  
          onClick={()=>ResetRows()}
          disabled={!isFiltered}
         >
          {resetLoading? <CircularProgress  color="inherit" size={20} />: <ReplayIcon/>} 
          
         </Button>
          </Box>
          
          {/* -------------------------------------------------- */}
{/* بعد عملية البحث وارسال طلب للباكإند */}
{/* !rows:teacher لما يحذف كل التقارير
   row.length==0: schoolAdmin لما ما يكون عنده ولا تقرير
*/}
          {!rows || rows?.length==0?
           <div className="alert alert-info text-center mt-2" role="alert">
           لا يوجد تقارير
         </div>
          :
          <>
          {/* عرض الاحصاءات بناء على المعلومات الموجودة بالجدول */}
         <StatisticsCard statisticsContent={statisticsContent}/>

            {/* TablePagination at the top */}
            <Box
            sx={{
              display: "flex",
              padding: "8px 16px",
              borderBottom: "none",
            }}
          >
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="عدد الصفوف لكل صفحة:"
              labelDisplayedRows={({ from, to, count }) =>
                `عرض ${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`
              }
              sx={{
                "& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "1rem",
                  },
              }}
            />
          </Box>

          {/* Table with scroll on the right */}
          <TableContainer
            sx={{
              maxHeight: 440,
              maxWidth: "100%",
              direction: "ltr",
              overflowY: "auto",
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                width: "10px",
                backgroundColor: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
              },
            }}
          >
            <Table stickyHeader aria-label="sticky table ">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center" // Center align the header cells
                      //   style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align="center">
                            {column.id === "rating" ? (
                              <Rating
                                name={`rating-${row.code}`}
                                value={value}
                                readOnly
                                precision={0.5}
                              />
                            ) : column.id === "operations" ? (
                              // and role == teacher
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: 1,
                                }}
                              >
                                {/* Edit Icon */}
                                <Box
                                  component="span"
                                  sx={{
                                    cursor: "pointer",
                                    color: "blue", // Change color to blue
                                    marginRight: "8px", // Add some spacing between icons
                                  }}
                                  onClick={() =>handelEditReport(row.code ,row.studentName)}
                                >
                                  <EditIcon />
                                </Box>

                                {/* Delete Icon */}
                                <Box
                                  component="span"
                                  sx={{
                                    cursor: "pointer",
                                    color: "red", // Change color to red
                                  }}
                                  onClick={() =>handelDeleteReport(row.code)}
                                >
                                  <DeleteIcon />
                                </Box>
                              </Box>
                            ) : column.id === "notes" && row.notes != "" ? (
                              <IconButton
                                onClick={() => openDetailsDialog(row.notes)}
                              >
                                <SearchIcon />
                              </IconButton>
                            ) :column.id === "notes" && row.notes == "" ? (
                               <p className=" m-0">_</p>
                            ) :column.id =="creationDate"||column.id =="date"? (
                              new Date(value).toLocaleDateString("en-GB")
                            ): column.id=="circleGender" ?(
                              value === "Male" ? "ذكور" :value === "Female"?"اناث":"ذكور واناث"
                            ):value}

                          </TableCell> 
                        );
                      })}
                    </TableRow>
                   
                  ))} 
              </TableBody>
            </Table>
          </TableContainer>
          </>
          }
        
         
      </Box>
      {/* ملاحظات */}
      {openDialog && (
        <CommonDialog
          open={openDialog}
          onClose={closeDetailsDialog}
          width="xs"
          title="الملاحظات"
          content={details}
        />
      )}
    {/* حذف تقرير */}
     {/* Delete Dialog */}
      {openConfirmDeleteDialog && <CommonDialog open={openConfirmDeleteDialog} onClose={closeDeleteDialog} width="xs" title="تأكيد الحذف" content=" هل تريد حذف هذا التقرير ؟"
      actions="حذف" actionFunction={DeleteReport}/>}


      {/* تعديل تقرير */}
     {openEditDialog && <CommonDialog open={openEditDialog} onClose={closeEditReportDialog} width="md" title=" تعديل الانجاز اليومي " content={<EditAchaievement reportId={reportId} studentName={studentName} onClose={closeEditReportDialog}/>}  />}
      
    </ThemeProvider>
    
  );
};
 


