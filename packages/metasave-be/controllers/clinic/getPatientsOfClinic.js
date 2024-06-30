const clinics = {
  "clinic1": [
    "QmURC4AqiMdHxNYCfSwQdCypcgyBx9gPCqidSURjZBfV6Z",
    "QmXYZ123abc456DEF789ghi012JKL345mno678PQR910stu",
    "Qm123456789abcdefABCDEFabcdef123456789ABCDEF"
  ],
  "clinic2": [
    "QmABC456def789GHI012jkl345MNO678pqr910STU123vwx",
    "QmDEF789ghi012JKL345mno678PQR910stu123vwx456yz",
    "Qm456789ABCDEFdef789GHI012jkl345MNO678pqr910"
  ],
  "clinic3": [
    "Qm789DEFghi012JKL345mno678PQR910stu123vwx456yz",
    "QmXYZ123abc456DEF789ghi012JKL345mno678PQR910stu",
    "Qm123456789ABCDEFdef789GHI012jkl345MNO678pqr910"
  ]
};

const getPatientsOfClinic = (req, res) => {
  const clinicId = req.params.clinicId;
  const patients = clinics[clinicId];

  if (patients) {
    res.json({ patients });
  } else {
    res.status(404).json({ message: "Clinic not found" });
  }
};

export default getPatientsOfClinic;
