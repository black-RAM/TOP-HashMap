const murmur = require("murmurhash-js")

class Node {
  // in the hash-map, each bucket is a doubly-linked list
  // understanding that is a bucket-list challenge (pun intended :)
  constructor(key, value) {
    this.key = key
    this.value = value
    this.previous = null
    this.next = null
  }
}

class HashMap {
  constructor() {
    this.buckets = Array(4)
    this.capacity = this.buckets.length
    this.load = 0.75
  }

  hash(key) {
    return murmur.murmur3(key, 31)
  }

  set(key, value) {
    if(typeof key !== "string"){
      throw new Error("Key of hashmap must be a string")
    }

    const object = new Node(key, value)
    const index = this.hash(key) % this.capacity
    let linkedList = this.buckets[index]

    if(linkedList) {
      // append to linked list
      while(linkedList.next) {
        if(linkedList.key === key) {
          // overwrite value
          linkedList.value = value
          return
        }
        linkedList = linkedList.next
      }
      object.previous = linkedList
      linkedList.next = object
    } else {
      // set as head of linked list
      this.buckets[index] = object      
    }
    this.expand()
  }

  expand() {
    const usedBuckets = this.buckets.reduce((count, bucket) => bucket ? ++count : count, 0)

    // double capacity if load factor exceeded
    if(usedBuckets > Math.floor(this.capacity * this.load)) {
      this.buckets = this.buckets.concat(Array(this.capacity))
      this.capacity = this.capacity * 2
    }
  }

  match(key) {
    const index = this.hash(key) % this.capacity
    let list = this.buckets[index]

    while (list) {
      if(list.key === key) return list
      list = list.next
    }

    return null
  }
  
  get(key) {
    const result = this.match(key)
    
    if (result) {
      return result.value
    } else {
      return null
    }
  }

  has(key) {
    // boolean arithmetic transforms Node to true and null to false
    return !!this.match(key)
  }

  remove(key) {
    if(!this.has(key)) return false

    const element = this.match(key)
    const index = this.hash(key) % this.capacity

    if(element.next || element.previous) {
      if(element.next) {
        element.next.previous = element.previous
      }
      if(element.previous) {
        element.previous.next = element.next
      } else {
        this.buckets[index] = element.next // update the head
      }
    } else {
      // empty bucket, since element was head
      this.buckets[index] = undefined
    }
    
    return true
  }

  length() {
    return this.buckets.reduce((sum, bucket) => {
      while(bucket) {
        bucket = bucket.next
        sum++
      }

      return sum
    }, 0)
  }

  entries() {
    return this.buckets.map(bucket => {
      const bucketList = [] // punned again ;)
      while(bucket) {
        bucketList.push([bucket.key, bucket.value])
        bucket = bucket.next
      }
      return bucketList
    }).flat()
  }

  keys() {
    return this.entries().map(entry => entry[0])
  }

  values() {
    return this.entries().map(entry => entry[1])
  }

  clear() {
    this.buckets = Array(this.capacity)
  }
}

const hashMap = new HashMap()
hashMap.set("column 1", "Hanamel")
hashMap.set("column 2", "Apple")
hashMap.set("column 3", "Nissan")
hashMap.set("column 4", "Roberta")
hashMap.set("column 5", "Liz")
hashMap.set("column 6", "Jireh")
hashMap.set("column 7", "Denise")
hashMap.set("column 8", "Wallace")
hashMap.set("column 9", "Shantelle")
hashMap.set("column 1", "Ariel")
console.log(hashMap.entries())