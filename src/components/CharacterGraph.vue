<template>
    <div class="contianer">
<div class="body">
    <svg width="auto" height="800" id="canvas" @wheel.prevent="trigger"></svg>
   
</div> 
<div v-show="selected != null" width="100" hight="100" id="popup">
    <p @click="selected = null">x</p>
    <p>characater name: {{selected?.name}} </p>
    <p>number of appearances: {{selected?.count}} </p>
    <p v-for="item in selected?.coreferenceList">
        {{item}}
    </p>

</div>
</div>
</template>
<script setup>
import * as d3 from "d3";
import {onMounted, ref, defineProps, watch} from "vue";

const selected = ref(null)

const props = defineProps({
    characaters: Array
});


onMounted(() => {
    
});

watch(() => props.characaters, (incoming, prev) => {


    d3.selectAll("line").remove()
    d3.selectAll("circle").remove()
    d3.selectAll("text").remove()
    selected.value = null;
    render(incoming);
    
 });
const render = (incoming) => {
    let svg = d3.select("svg")
 
    let max = Math.max.apply(Math, incoming.map(c => c.count));
    let min = Math.min.apply(Math, incoming.map(c => c.count));
    let total = incoming.map(c => c.count).reduce((a, b) => a + b, 0);

    let nodes = incoming.map(c =>{
        return {name: c.name, value: c.count}
    });
    let links = [];
    for (const c of incoming){
        for(const a in c.adjecencyList){
            if(links.includes({source: a, target: c.name, value: c.adjecencyList[a]}))
            {
                continue;
            }
            links.push({source: c.name, target : a, value: c.adjecencyList[a]})
        }
    }

    let simulation = d3.forceSimulation(nodes, 3)
                       .force("link", d3.forceLink(links).id(d => d.name).distance(d => d.value * 30))
                       .force('charge', d3.forceManyBody().strength(-1))
                       .force('center', d3.forceCenter(650, 300))
                       .force("collision", d3.forceCollide().radius(9))
                

    let link = svg.append("g")
                  .selectAll("line")
                  .data(links)
                  .enter()
                  .append("line")
                  .attr("stroke-width", d => d.value / 20)
                  .attr("stroke", "gray")
                  .text(d => d.value)
   
       
    let textAndNodes = svg.append("g")
                          .selectAll("g")
                          .data(nodes)
                          .enter()
                          .append("g").attr("class", "scene")
                          .call(d3.drag()
                                  .on("start", (event, d) => dragStart(event, d, simulation))
                                  .on("drag", (event, d) => dragGoing(event, d))
                                  .on("end", (event, d) => dragEnd(event, d, simulation)))
                          .on("dblclick", (event) => handleDoubleClick(event, incoming));


    let circles = textAndNodes.append("circle")
                              .attr("r", d => (d.value - min) / (max - min))
                              .attr("fill", _ => "orange")
                              .attr("stroke", "orange");

    let texts = textAndNodes.append('text').text(d =>{
        if(d.value >= (total / 50)) {
            return d.name
        }
    }).style("color", _ => "green");
    
        
    simulation.on('tick', _ => {
        textAndNodes.attr("transform", d => "translate(" +d.x +", "+d.y +")")
        circles.attr('r', d => (d.value - min) / (max - min) * 50);
        

        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)

    });
}
const handleDoubleClick = (event, incoming) =>{
    let name =  event.srcElement.__data__.name;
    selected.value = incoming.filter(u => u.name == name)[0];

    let div = document.getElementById('popup');
    div.style.left = `${event.clientX}px`;
    div.style.top = `${event.clientY}px`;
}

const dragStart = (event, d, simulation) => {
    if(!event.active){
        simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y
}
const dragGoing = (event, d) =>
{
    d.fx = event.x;
    d.fy = event.y;
} 
const dragEnd = (event, d, simulation) => {
    if(!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

const  getOffset = (element) =>{
    debugger;
    var bound = element.getBoundingClientRect();
    var html = document.documentElement;

    return {
        top: bound.top + window.pageYOffset - html.clientTop,
        left: bound.left + window.pageXOffset - html.clientLeft
    };
}


</script>

<style>
.rect{
    display: inline-block;
    margin: 2px;
    background-color: orange;
    color: white;
    padding: 8px;
    width: 100px;
    height: 14;
    text-align: center;
}
.body{
    width: 100%
}
svg{
    border: 1px solid black;
}
#popup{
    border: 1px solid blue;
    position: absolute;
    z-index: 1;
    background-color: aquamarine;
    padding: 10px;
}


</style>