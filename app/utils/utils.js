type treeItem = {
  children: Array<TreeItem>
};
export default {
  /**
   * 树的遍历
   *
   * @param {Array} tree
   * @param {any|null} parentItem
   * @param {(key: string, item: any ) => boolean} func (func的返回值决定是否继续遍历: TODO: 暂不支持异步)
   * @param {boolean} deep (是否深度优先)
   */
  treeTravel(
    tree: Array<treeItem>,
    parentItem: any | null,
    func: (
      key: string,
      item: any,
      parentItem: any | null,
      index: number
    ) => boolean,
    deep: boolean = true
  ) {
    if (deep) {
      tree.some((item, index) => {
        if (func(item.key, item, parentItem, index)) {
          return true;
        }
        if (item.children) {
          // TODO: 这里调用是必须用Utils.treeTravel, 否则this找不到, 需要改写一下
          this.treeTravel(item.children, item, func);
        }
        return false;
      });
    }
  },

  /**
   * 树添加一个新节点
   *
   * @param {Array<treeItem>} tree
   * @param {string} parentKey
   * @param {*} newItem
   */
  treeAdd(tree: Array<treeItem>, parentKey: string | null, newItem: any) {
    if (parentKey === null) {
      tree.push(newItem);
    }
    this.treeTravel(tree, null, (key, item) => {
      if (parentKey === key) {
        item.children.push(newItem);
        return true;
      }
      return false;
    });
  },
  treeDelete(tree: Array<treeItem>, deleteKey: string) {
    this.treeTravel(tree, null, (key, item, parentItem, index) => {
      const pNode = parentItem;
      if (deleteKey === key) {
        if (parentItem === null) {
          tree = tree.splice(index, 1);
        } else {
          pNode.children = parentItem.children.filter(
            node => node.key !== deleteKey
          );
        }
        return true;
      }
      return false;
    });
  }
};
