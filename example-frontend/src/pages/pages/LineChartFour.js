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

function LineChartTwo({ theme }) {
  const data = {
    labels: [
      "3:00",
      "3:05",
      "3:10",
      "3:15",
      "3:20",
      "3:25",
      "3:30",
      "3:35",
      "3:40",
      "3:45",
      "3:50",
      "3:55"
    ],
    datasets: [
      {
        label: "Radar Sensor 1",
        fill: false,
        backgroundColor: [
          "transparent",
          "transparent",
          "transparent",
          "transparent",
          "transparent",
          red[500],
          red[500],
          red[500],
          red[500],
          red[500],
          red[500],
          red[500]
        ],
        borderColor: theme.palette.grey[500],
        data: [
          58,
          24,
          59,
          83,
          10,
          0,
          2,
          1,
          0,
          5,
          3,
          1
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
          Current Data 
        </Typography>
        <Typography variant="body2" gutterBottom>
          Overall Observations Per Sensor
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Line data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}

export default withTheme(LineChartTwo);
