import React from "react";
import styled, { withTheme } from "styled-components";

import { CardContent, Card as MuiCard, Typography } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { blue, orange, green, red } from "@material-ui/core/colors";

import { Line } from "react-chartjs-2";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  height: 300px;
`;

function LineChartOne({ theme }) {
  const data = {
    labels: [
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug"
    ],
    datasets: [
      {
        label: "Lidar Sensor 1",
        fill: true,
        backgroundColor: "transparent",
        borderColor: theme.palette.secondary.main,
        data: [
          2115,
          1562,
          1584,
          1892,
          1487,
          2223,
          2966,
          2448,
          2905,
          3838,
          2917,
          3327
        ]
      },
      {
        label: "Radar Sensor 1",
        fill: true,
        backgroundColor: "transparent",
        borderColor: theme.palette.grey[500],
        data: [
          958,
          724,
          629,
          883,
          915,
          1214,
          1476,
          1212,
          1554,
          2128,
          1466,
          1827
        ]
      },
      {
        label: "Desert Laser",
        fill: true,
        backgroundColor: "transparent",
        borderColor: orange[500],
        data: [
          358,
          124,
          529,
          1183,
          961,
          1554,
          1776,
          612,
          354,
          628,
          412,
          450
        ]
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    legend: {
      display: true
    },
    tooltips: {
      intersect: false
    },
    hover: {
      intersect: true
    },
    plugins: {
      filler: {
        propagate: false
      }
    },
    scales: {
      xAxes: [
        {
          reverse: true,
          gridLines: {
            color: "rgba(0,0,0,0.05)"
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            stepSize: 500
          },
          display: true,
          borderDash: [5, 5],
          gridLines: {
            color: "rgba(0,0,0,0)",
            fontColor: "#fff"
          }
        }
      ]
    }
  };

  return (
    <Card mb={1}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Historical Sensor Data 
        </Typography>
        <Typography variant="body2" gutterBottom>
          Overall Outage Time at each sensor monthly
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Line data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}

export default withTheme(LineChartOne);
