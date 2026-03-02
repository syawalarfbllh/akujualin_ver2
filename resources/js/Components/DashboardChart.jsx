import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Box, Text, Paper, Title, useMantineTheme } from "@mantine/core";

export default function DashboardChart({ data, title, color = "indigo" }) {
    const theme = useMantineTheme();

    // 1. Handle jika data kosong
    if (!data || data.length === 0) {
        return (
            <Paper
                withBorder
                p="md"
                radius="md"
                h={300}
                display="flex"
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    borderStyle: 'dashed'
                }}
            >
                <Text c="dimmed" size="sm">
                    Belum ada data pendapatan pada periode ini.
                </Text>
            </Paper>
        );
    }

    // 2. Custom Tooltip yang ramah sentuhan (Touch-friendly)
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Paper shadow="xl" p="xs" withBorder radius="md">
                    <Text size="xs" fw={700} c="dimmed" mb={2}>
                        {payload[0].payload.date}
                    </Text>
                    <Text size="sm" fw={800} c={`${color}.7`}>
                        Rp {payload[0].value.toLocaleString("id-ID")}
                    </Text>
                </Paper>
            );
        }
        return null;
    };

    return (
        <Box>
            {title && (
                <Title order={4} mb="lg" size={{ base: 'sm', sm: 'md' }}>
                    {title}
                </Title>
            )}
            
            {/* Box container dengan tinggi dinamis */}
            <Box w="100%" h={{ base: 250, sm: 350 }}>
                <ResponsiveContainer width="99%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={theme.colors[color][6]}
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={theme.colors[color][6]}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={theme.colors.gray[2]}
                        />
                        
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: theme.colors.gray[6] }}
                            minTickGap={25} // Mencegah teks tanggal tabrakan di layar HP yang sempit
                            dy={10}
                        />
                        
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: theme.colors.gray[6] }}
                            tickFormatter={(value) => {
                                if (value >= 1000000) return `${value / 1000000}jt`;
                                if (value >= 1000) return `${value / 1000}rb`;
                                return value;
                            }}
                            width={45} // Memberikan ruang cukup agar label harga terlihat
                        />
                        
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ stroke: theme.colors[color][2], strokeWidth: 2 }}
                        />
                        
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke={theme.colors[color][6]}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}