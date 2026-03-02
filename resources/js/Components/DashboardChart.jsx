import { AreaChart } from '@mantine/charts';
import { Paper, Group, Title, Box, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function DashboardChart({ data, title, filters }) {
    
    const handleDateChange = (type, value) => {
        const newFilters = { 
            ...filters, 
            [type]: value ? dayjs(value).format('Y-m-d') : null 
        };
        // Kirim ulang request ke server dengan filter baru
        router.get(window.location.pathname, {
            start_date: newFilters.start,
            end_date: newFilters.end
        }, { preserveState: true, preserveScroll: true });
    };

    const formattedData = data.length > 0 
        ? data.map(d => ({ date: dayjs(d.date).format('DD MMM'), "Total": d.total }))
        : [{ date: 'No Data', "Total": 0 }];

    return (
        <Paper withBorder p="md" radius="md">
            <Group justify="space-between" mb="xl">
                <Title order={4}>{title}</Title>
                <Group>
                    <DateInput 
                        placeholder="Mulai" 
                        size="xs" 
                        value={filters.start ? new Date(filters.start) : null}
                        onChange={(v) => handleDateChange('start', v)}
                    />
                    <DateInput 
                        placeholder="Selesai" 
                        size="xs"
                        value={filters.end ? new Date(filters.end) : null}
                        onChange={(v) => handleDateChange('end', v)}
                    />
                </Group>
            </Group>
            
            <Box h={300}>
                <AreaChart
                    h={300}
                    data={formattedData}
                    dataKey="date"
                    series={[{ name: 'Total', color: 'indigo.6' }]}
                    curveType="monotone"
                    valueFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                />
            </Box>
        </Paper>
    );
}