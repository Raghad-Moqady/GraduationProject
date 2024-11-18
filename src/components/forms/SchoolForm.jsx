import React, { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  schoolFormSchema,
  managerFormSchema,
} from "../authentication/validation/validate";
import Input from "../authentication/Input";
import style from "./Form.module.css";
import formStyle from "../authentication/Auth.module.css";

export default function SchoolAndManagerForm() {
  const [step, setStep] = useState(1);
  const [schoolData, setSchoolData] = useState(null);
  const [logoFileName, setLogoFileName] = useState("شعار المدرسة");
  const [officialDocumentFileName, setOfficialDocumentFileName] =
    useState("الوثيقة الرسمية");

  const schoolFormik = useFormik({
    initialValues: {
      schoolName: "",
      address: "",
      logo: null,
      officialDocument: null,
    },
    validationSchema: schoolFormSchema,
    onSubmit: (values) => {
      setSchoolData(values);
      setStep(2);
    },
  });

  const managerFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      id: "",
      email: "",
      birthDate: "",
      phonePrefix: "",
      phone: "",
      gender: "",
      password: "",
      confirmPassword: "",
      city: "",
    },
    validationSchema: managerFormSchema,
    onSubmit: (managerValues) => {
      const finalPhone = `${managerValues.phonePrefix}${managerValues.phone}`;
      const finalData = {
        ...schoolData,
        manager: { ...managerValues, phone: finalPhone },
      };
      console.log("Final Data Submitted:", finalData);
      toast.success("تم رفع الطلب , سيتم التواصل معك عبر البريد الالكتروني");
    },
  });

  const schoolInputs = [
    {
      id: "schoolName",
      type: "text",
      name: "schoolName",
      title: "اسم المدرسة",
      value: schoolFormik.values.schoolName,
    },
    {
      id: "address",
      type: "text",
      name: "address",
      title: "العنوان",
      value: schoolFormik.values.address,
    },
    {
      id: "logo",
      type: "file",
      name: "logo",
      title: "شعار المدرسة",
      value: schoolFormik.values.logo,
    },
    {
      id: "officialDocument",
      type: "file",
      name: "officialDocument",
      title: "الوثيقة الرسمية",
      value: managerFormik.values.resume,
    },
  ];
  const handleLogoChange = (event) => {
    const file = event.currentTarget.files[0];
    setLogoFileName(file ? file.name : "شعار المدرسة");
    schoolFormik.setFieldValue("logo", file);
  };

  const handleOfficialDocumentChange = (event) => {
    const file = event.currentTarget.files[0];
    setOfficialDocumentFileName(file ? file.name : "الوثيقة الرسمية");
    managerFormik.setFieldValue("officialDocumentFileName", file);
  };

  const renderSchoolInputs = schoolInputs.map((input, index) => (
    <div key={index} className={`${formStyle.inputWrapper}`}>
      {input.type === "file" ? (
        input.name === "logo" ? (
          <>
            <label htmlFor={input.id} className={formStyle.fileInputLabel}>
              {logoFileName}
            </label>
            <input
              id={input.id}
              type="file"
              name={input.name}
              className={formStyle.fileInput}
              onChange={handleLogoChange}
              onBlur={schoolFormik.handleBlur}
            />
          </>
        ) : (
          <>
            <label htmlFor={input.id} className={formStyle.fileInputLabel}>
              {officialDocumentFileName}
            </label>
            <input
              id={input.id}
              type="file"
              name={input.name}
              className={formStyle.fileInput}
              onChange={handleOfficialDocumentChange}
              onBlur={schoolFormik.handleBlur}
            />
          </>
        )
      ) : (
        <Input
          id={input.id}
          type={input.type}
          name={input.name}
          title={input.title}
          value={input.value}
          errors={schoolFormik.errors}
          onChange={schoolFormik.handleChange}
          onBlur={schoolFormik.handleBlur}
          touched={schoolFormik.touched}
        />
      )}
    </div>
  ));

  const managerInputs = [
    {
      id: "firstName",
      type: "text",
      name: "firstName",
      title: "الاسم الأول",
      value: managerFormik.values.firstName,
    },
    {
      id: "lastName",
      type: "text",
      name: "lastName",
      title: "اسم العائلة",
      value: managerFormik.values.lastName,
    },
    {
      id: "id",
      type: "text",
      name: "id",
      title: "رقم الهوية",
      value: managerFormik.values.id,
    },
    {
      id: "email",
      type: "email",
      name: "email",
      title: "البريد الإلكتروني",
      value: managerFormik.values.email,
    },
    {
      id: "city",
      type: "select",
      name: "city",
      title: "المدينة",
      value: managerFormik.values.city,
      options: [
        "القدس",
        "رام الله",
        "نابلس",
        "الخليل",
        "جنين",
        "بيت لحم",
        "أريحا",
        "قلقيلية",
        "طولكرم",
        "طوباس",
        "سلفيت",
        "غزة",
        "رفح",
        "خان يونس",
        "جباليا",
        "دير البلح",
      ],
    },
    {
      id: "birthDate",
      type: "date",
      name: "birthDate",
      title: "تاريخ الميلاد",
      value: managerFormik.values.birthDate,
    },
    {
      id: "phonePrefix",
      type: "select",
      name: "phonePrefix",
      title: "مقدمة الهاتف",
      value: managerFormik.values.phonePrefix,
      options: ["+970", "+972"],
    },
    {
      id: "phone",
      type: "text",
      name: "phone",
      title: "رقم الجوال",
      value: managerFormik.values.phone,
    },
    {
      id: "gender",
      type: "select",
      name: "gender",
      title: "الجنس",
      value: managerFormik.values.gender,
      options: ["ذكر", "أنثى"],
    },
    {
      id: "password",
      type: "password",
      name: "password",
      title: "كلمة المرور",
      value: managerFormik.values.password,
    },
    {
      id: "confirmPassword",
      type: "password",
      name: "confirmPassword",
      title: "تأكيد كلمة المرور",
      value: managerFormik.values.confirmPassword,
    },
  ];

  // const renderManagerInputs = managerInputs.map((input, index) => (
  //   <div key={index} className={`${formStyle.inputWrapper}`}>
  //     <Input
  //       id={input.id}
  //       type={input.type}
  //       name={input.name}
  //       title={input.title}
  //       value={input.value}
  //       errors={managerFormik.errors}
  //       onChange={managerFormik.handleChange}
  //       onBlur={managerFormik.handleBlur}
  //       touched={managerFormik.touched}
  //       options={input.options}
  //     />
  //   </div>
  // ));
  const renderManagerInputs = managerInputs.map((input, index) => {
    if (input.name === "phonePrefix" || input.name === "phone") {
      return null;
    }

    return (
      <div key={index} className={`${formStyle.inputWrapper}`}>
        <Input
          id={input.id}
          type={input.type}
          name={input.name}
          title={input.title}
          value={input.value}
          errors={managerFormik.errors}
          onChange={managerFormik.handleChange}
          onBlur={managerFormik.handleBlur}
          touched={managerFormik.touched}
          options={input.options}
        />
      </div>
    );
  });

  const phoneInputs = (
    <div className="d-flex align-items-center" key="phoneFields">
      <div
        className={`${formStyle.inputWrapper} me-2`}
        style={{ flex: "0 0 25%" }}
      >
        <Input
          id="phonePrefix"
          type="select"
          name="phonePrefix"
          title="مقدمة الهاتف"
          value={managerFormik.values.phonePrefix}
          errors={managerFormik.errors}
          onChange={managerFormik.handleChange}
          onBlur={managerFormik.handleBlur}
          touched={managerFormik.touched}
          options={["+970", "+972"]}
        />
      </div>
      <div className={`${formStyle.inputWrapper}`} style={{ flex: "1" }}>
        <Input
          id="phone"
          type="text"
          name="phone"
          title="رقم الجوال"
          value={managerFormik.values.phone}
          errors={managerFormik.errors}
          onChange={managerFormik.handleChange}
          onBlur={managerFormik.handleBlur}
          touched={managerFormik.touched}
        />
      </div>
    </div>
  );

  return (
    <div className={`${style.form_container}`}>
      <div className={`${formStyle.formDesign}`}>
        {step === 1 && (
          <>
            <h2 className={`${formStyle.formTitle} text-center mt-3 mb-4`}>
              معلومات المدرسة
            </h2>
            <form
              onSubmit={schoolFormik.handleSubmit}
              className={`${formStyle.form}`}
            >
              <div className="container-fluid">
                {renderSchoolInputs}
                <div className="mt-3">
                  <button
                    type="submit"
                    disabled={!schoolFormik.isValid}
                    className={`${formStyle.button}`}
                  >
                    التالي
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={`${formStyle.formTitle} text-center mt-3 mb-4`}>
              معلومات المدير
            </h2>
            <form
              onSubmit={managerFormik.handleSubmit}
              className={`${formStyle.form}`}
            >
              <div className="container-fluid">
                {renderManagerInputs.map((field, index) =>
                  managerInputs[index]?.name === "email" ? (
                    <React.Fragment key={index}>
                      {field}
                      {phoneInputs}
                    </React.Fragment>
                  ) : (
                    field
                  )
                )}
                <div className="mt-3">
                  <button
                    type="submit"
                    disabled={!managerFormik.isValid}
                    className={`${formStyle.button}`}
                  >
                    ارسال
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
