interface TaskDataInterface {
  task: {
    name: string,
    retry: number,
    next: {
      success: string,
      fail: string,
    }
  }
}

interface WorkflowNodeInterface {
  id: string,
  parentIds: string[]
}

export function format(dataList: TaskDataInterface[]) {
  let res: WorkflowNodeInterface[] = [];

  dataList.forEach(task => {
    let name = task.task.name;
    let obj: WorkflowNodeInterface = { id: name, parentIds: [] };
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
