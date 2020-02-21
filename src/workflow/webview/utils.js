export function format(dataList) {
  let res = [];
  dataList.forEach(task => {
    let name = task.task.name;
    let obj = { id: name, parentIds: [] };
    dataList.forEach((item, index) => {
      let success = item.task.next.success;
      let fail = item.task.next.fail;
      if (success === name && success !== dataList[index].task.name) {
        obj.parentIds.push(dataList[index].task.name);
      }
      if (fail === name && fail !== dataList[index].task.name) {
        obj.parentIds.push(dataList[index].task.name);
      }
    });
    res.push(obj);
  });
  return res;
}
