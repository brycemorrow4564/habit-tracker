// https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript

const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  *[Symbol.iterator]() {
    // perform BFS traversal of the binary tree stored in _heap 
    // using virtual indexing. 
    let bfs = []; 
    let q = [top]; 
    while (q) {
      // add all nodes in the current level to the bfs traversal 
      for (let i of q) {
        bfs.push(i); 
      }
      // add the children of all nodes in the current level (from l -> r)
      let numToPop = q.length; 
      for (let x = 0; x < numToPop; x++) {
        let i = q.shift(); 
        let l = left(i); 
        let r = right(i); 
        if (l >= 0 && l < this._heap.length) {
          q.push(l); 
        }
        if (r >= 0 && r < this._heap.length) {
          q.push(r); 
        }
      }
    }
    // use the BFS traversal to supply sequential items to the generator 
    for (let i of bfs) {
      yield this._heap[i]; 
    }
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

export default PriorityQueue;