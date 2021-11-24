const passCookiesToResponse = (res, headers) => {
  const headerName = "set-cookie";
  if (headers && headers.get(headerName)) {
    res.setHeader(headerName, headers.raw()[headerName]);
  }
};
export default passCookiesToResponse;
