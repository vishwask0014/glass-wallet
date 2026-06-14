const DateFormat = (data: string) => {
  const date = new Date(data);
  const formattedDate = date.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  return formattedDate;
};

export default DateFormat;
