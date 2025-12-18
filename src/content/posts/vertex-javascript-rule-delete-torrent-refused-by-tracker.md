---
title: Vertex JavaScript 规则，自动删已被 Tracker 报错种
published: 2025-09-09
description: ''
image: ''
tags: [vertex, torrent, javascript]
category: '技术教程'
draft: false 
lang: ''
---
```javascript
(maindata, torrent) => {
  const categoryList = ["不删", "ipt", "TL"];
  const { trackerStatus, category } = torrent;
  
  const deletedMessages = [
    "torrent banned",
    "Torrent not exists",
    "torrent not registered with this tracker",
    "unregistered torrent",
    "Invalid Torrent:"
 
  ];
  
  if (categoryList.indexOf(category) !== -1) {
    return false;
  }  
  
  if (trackerStatus) {
    const trackerMessage = trackerStatus.toLowerCase();
    return deletedMessages.some(msg => trackerMessage.includes(msg.toLowerCase()));
  }
  
  return false;
};
```