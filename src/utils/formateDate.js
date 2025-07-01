export default function formateDate(timestamp){
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0"); // months are 0-indexed
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
}