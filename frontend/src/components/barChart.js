import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
    // "d3": "^7.9.0",
const BarChart = () => {
  const chartRef = useRef();
  const data = [
    { label: "Apples", value: 100 },
    { label: "Bananas", value: 200 },
    { label: "Oranges", value: 50 },
    { label: "Kiwis", value: 150 }
  ];
  useEffect(() => {
    // Set dimensions and margins for the chart
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Clear any existing SVG
    d3.select(chartRef.current).select('svg').remove();

    // Append SVG element to the chartRef
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up the scales
    const xScale = d3.scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, width - margin.left - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.top - margin.bottom, 0]);

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(i => `Item ${i + 1}`));

    // Add y-axis
    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Create bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - margin.top - margin.bottom - yScale(d.value))
      .attr('fill', 'steelblue');

  });

  return <div ref={chartRef}></div>;
};

export default BarChart;


// // import express from "express";
// import mongoose from "mongoose";
const express = require("express")
const mongoose = require("mongoose")

const app = express();
const PORT = 8000;

//mongoDB conection
mongoose.connect('mongodb://127.0.0.1:27017/data-visualization')
.then(()=>console.log("MongoDB connection SUCCESSFUL"))
.catch((e)=>{console.log("mongoDB connections ERROR:", e)})

// Schema
const tableSchema = new mongoose.Schema({
    
end_year:{
    type: String
},
intensity: {
    type: Number
},
sector: {
    type: String
},
topic: {
    type: String
},
insight: {
    type: String
},
url: {
    type: String
},
region: {
    type: String
},
start_year: {
    type: String
},
impact: {
    type: String
},
added: {
    type: Date
},
published: {
    type: String
},
country: {
    type: String
},
relevance: {
    type: Number
},
pestle: {
    type: String
},
source: {
    type: String
},
title: {
    type: String
},
likelihood: {
    type: Number
},
})

const dataModel = mongoose.model('mytable', tableSchema);

app.listen(PORT, ()=> console.log(`server started at PORT ${PORT}`));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.get('/', async(req, res)=>{
    const data = await dataModel.find({});

    res.json(data);
})


// Routes
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send('Email and password are required.');

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).send('User registered successfully');
  } catch (err) {
      res.status(400).send('User already exists');
  }
});