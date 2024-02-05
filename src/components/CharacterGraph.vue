<template>
    
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
    console.log(incoming)
    let svg = d3.select("svg")
    let max = Math.max.apply(Math, incoming.map(c => c.count));
    let min = Math.min.apply(Math, incoming.map(c => c.count));
    let totalCharcters = incoming.map(c => c.count).reduce((a, b) => a + b, 0);

    //calculate the total number of interactions between characters removing duplicates
    let totalInteractions = 0;
    for (const c of incoming){
        for(const a in c.adjecencyList){
            totalInteractions += c.adjecencyList[a];
        }
    }
    totalInteractions = totalInteractions / 2;


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
                       .force('center', d3.forceCenter(900, 350))
                       .force("collision", d3.forceCollide().radius(1))
                

    let link = svg.append("g")
                  .selectAll("line")
                  .data(links)
                  .enter()
                  .append("line")
                  // make the line color be a percentage of the total value
                  .attr("stroke", d => {
                        if((d.value * 100) / totalInteractions >= 5){
                            return "#69b7f7"
                        }
                        else{
                            return "#FBFEF9"
                        }
                    })
                    .attr("stroke-opacity", d => d.value / 20)
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
        .attr("r", d => {
            return Math.log10(d.value);

                              }
                               )                 //957DAD
                              .attr("fill", _ => "#F3C178")
                              .attr("stroke", "black");

    let texts = textAndNodes.append('text').text(d =>{
        if(d.value >= (totalCharcters * 3) / 100) {
            return d.name
        }
    }).style("fill", _ => "whitesmoke")
      .style("paint-order", "stroke")
      .style("stroke", "black")
      .style("stroke-width", "3.5px")
      .style("transform", "translate(-11px, -16px)");
    
        
    simulation.on('tick', () => {
        textAndNodes.attr("transform", d => "translate(" +d.x +", "+d.y +")")
        circles.attr('r', d =>{
                            if (d.value > 50){
                                return Math.log(d.value) * 2
                            }
                            else{
                            return 5
                            }
                        }).each(d => gravity(0.2, d));
        

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
    var bound = element.getBoundingClientRect();
    var html = document.documentElement;

    return {
        top: bound.top + window.pageYOffset - html.clientTop,
        left: bound.left + window.pageXOffset - html.clientLeft
    };
}
function gravity(alpha, d) {
  return function() {
    var angle = Math.atan2(y - d.y, x - d.x); // angle from center
    var rad = ring(d.radius); // radius of ring of attraction

    // closest point on ring of attraction
    var rx = x - Math.cos(angle) * rad;
    var ry = y - Math.sin(angle) * rad;

    // move towards point
    d.x += (rx - d.x) * alpha;
    d.y += (ry - d.y) * alpha;
  };
}


</script>

<style>
.rect{
    display: inline-block;
    margin: 2px;
    background-color: #F3C178;
    color: white;
    padding: 8px;
    width: 100px;
    height: 14;
    text-align: center;
    color: #69b7f7;
}
.body{
    display: flex;
    margin-left: 10px;
    margin-right: 10px;
    max-height: 100%;
    overflow: auto;
    background-color: #373F51;
    border-radius: 3px;
    box-shadow: #ffffff1a 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, #0000004d 0px 30px 60px -30px;

}
svg{
    border-right: none;
}
#popup{
    border: 1px solid rgb(98, 98, 235);
    position: absolute;
    z-index: 1;
    padding: 10px;
}
.scene{
    cursor: pointer;
}
.text{
    font-size: 10px;
    fill: #D64933;
}


</style>