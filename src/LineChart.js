import React from "react";
import { MDBContainer } from "mdbreact";
import { Chart } from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import './App.css';

const LineChart = (list) => {
    

    const gpaPerSem = list.gpaPerSem.map((v) => {
        return (parseFloat(v));
    })
    

    return (
        <MDBContainer>
            <Line style={{ width: '60vw', height: '30vh', maxWidth:'60vw', maxHeight:'30vh' }}
                data={{
                    labels: list.perSem,
                    datasets: [
                        {
                            label: "GPA per semester",
                            data: gpaPerSem,
                            fill: true,
                            backgroundColor: "rgba(255,255,255",
                            borderColor: "#FF3547",
                        }
                    ]
                }}
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            min: 0,
                            max: 4
                        }

                    }
                }}
            />


        </MDBContainer>
    );
}

export default LineChart;