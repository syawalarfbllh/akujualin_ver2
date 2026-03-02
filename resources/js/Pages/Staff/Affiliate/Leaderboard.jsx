import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import {
    Table,
    Card,
    Text,
    Avatar,
    Group,
    Title,
    Box,
    Tabs,
    Badge,
    Stack,
} from "@mantine/core";
import { IconChartBar, IconCrown, IconShoppingBag } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function Leaderboard({ auth, leaderboardData }) {
    // State tab: "sales" atau "orders"
    const [activeTab, setActiveTab] = useState("sales");

    const formatCurrency = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const Podium = ({ data }) => {
        const top3 = data.slice(0, 3);
        const podiumOrder = [top3[1], top3[0], top3[2]];

        return (
            <Group justify="center" align="flex-end" gap="xs" mb={40} mt={20}>
                {podiumOrder.map((user, index) => {
                    if (!user) return <Box key={`empty-${index}`} w={110} />;
                    const isFirst = user.rank === 1;

                    return (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: isFirst ? 160 : 120,
                                zIndex: isFirst ? 2 : 1,
                            }}
                        >
                            {isFirst && (
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                    }}
                                >
                                    <IconCrown
                                        size={44}
                                        color="gold"
                                        fill="gold"
                                    />
                                </motion.div>
                            )}

                            <Avatar
                                src={user.avatar}
                                size={isFirst ? 100 : 80}
                                radius="100%"
                                style={{
                                    border: isFirst
                                        ? "4px solid #FFD700"
                                        : user.rank === 2
                                          ? "3px solid #C0C0C0"
                                          : "3px solid #CD7F32",
                                    marginBottom: 10,
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                                }}
                            >
                                {user.name.charAt(0)}
                            </Avatar>

                            <Text
                                fw={700}
                                size="sm"
                                ta="center"
                                lineClamp={1}
                                px={5}
                            >
                                {user.name}
                            </Text>

                            {/* Logic Tampilan Nilai Utama di Podium */}
                            <Text
                                fw={800}
                                size="lg"
                                c={
                                    activeTab === "sales"
                                        ? "blue.8"
                                        : "orange.8"
                                }
                            >
                                {activeTab === "sales"
                                    ? formatCurrency(user.value)
                                    : `${user.value} Pesanan`}
                            </Text>

                            {/* Info Tambahan di bawah Nilai Utama */}
                            {activeTab === "sales" ? (
                                <Badge
                                    variant="light"
                                    color="gray"
                                    size="xs"
                                    mb={10}
                                    leftSection={<IconShoppingBag size={10} />}
                                >
                                    {user.orders} Pesanan
                                </Badge>
                            ) : (
                                <Text size="xs" c="dimmed" mb={10}>
                                    {formatCurrency(user.sales_amount)}
                                </Text>
                            )}

                            <Box
                                style={{
                                    width: "100%",
                                    height: isFirst
                                        ? 140
                                        : user.rank === 2
                                          ? 100
                                          : 80,
                                    background: isFirst
                                        ? "linear-gradient(180deg, #FFD700 0%, #FFA500 100%)"
                                        : user.rank === 2
                                          ? "linear-gradient(180deg, #E0E0E0 0%, #BDBDBD 100%)"
                                          : "linear-gradient(180deg, #E3AF66 0%, #CD7F32 100%)",
                                    borderRadius: "12px 12px 0 0",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                }}
                            >
                                <Text
                                    fw={900}
                                    c="white"
                                    style={{
                                        fontSize: isFirst ? 45 : 35,
                                        opacity: 0.9,
                                    }}
                                >
                                    {user.rank}
                                </Text>
                            </Box>
                        </motion.div>
                    );
                })}
            </Group>
        );
    };

    const renderTable = (data, type) => (
        <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
            <Table.Thead bg="gray.0">
                <Table.Tr>
                    <Table.Th w={80} ta="center">
                        Rank
                    </Table.Th>
                    <Table.Th>Affiliator</Table.Th>
                    <Table.Th ta="right">Performa</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {data.slice(3).map((item) => (
                    <Table.Tr key={item.id}>
                        <Table.Td ta="center">
                            <Text fw={700} size="sm" c="dimmed">
                                {item.rank}
                            </Text>
                        </Table.Td>
                        <Table.Td>
                            <Group gap="sm">
                                <Avatar src={item.avatar} size="sm" radius="xl">
                                    {item.name.charAt(0)}
                                </Avatar>
                                <Text size="sm" fw={600}>
                                    {item.name}
                                </Text>
                            </Group>
                        </Table.Td>
                        <Table.Td ta="right">
                            <Stack gap={0} align="flex-end">
                                <Text
                                    fw={700}
                                    size="sm"
                                    c={type === "sales" ? "blue.7" : "orange.7"}
                                >
                                    {type === "sales"
                                        ? formatCurrency(item.value)
                                        : `${item.value} Pesanan`}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {type === "sales"
                                        ? `${item.orders} Pesanan`
                                        : formatCurrency(item.sales_amount)}
                                </Text>
                            </Stack>
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Leaderboard Affiliator" />
            <Box mb="xl" ta="center">
                <Title
                    order={2}
                    variant="gradient"
                    gradient={{ from: "blue.7", to: "cyan.7" }}
                    fw={900}
                >
                    TOP AFFILIATOR
                </Title>
                <Text c="dimmed" size="sm">
                    Berdasarkan data aktivitas Marketplace bulan ini
                </Text>
            </Box>

            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                variant="pills"
                radius="xl"
                justify="center"
            >
                <Tabs.List mb={30}>
                    <Tabs.Tab
                        value="sales"
                        leftSection={<IconChartBar size={16} />}
                    >
                        Nilai Jual
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="orders"
                        leftSection={<IconShoppingBag size={16} />}
                    >
                        Pesanan Masuk
                    </Tabs.Tab>
                </Tabs.List>

                <Podium data={leaderboardData[activeTab]} />

                <Card
                    withBorder
                    radius="lg"
                    p="0"
                    shadow="sm"
                    style={{ overflow: "hidden" }}
                >
                    <Tabs.Panel value="sales">
                        {renderTable(leaderboardData.sales, "sales")}
                    </Tabs.Panel>
                    <Tabs.Panel value="orders">
                        {renderTable(leaderboardData.orders, "orders")}
                    </Tabs.Panel>
                </Card>
            </Tabs>
        </AuthenticatedLayout>
    );
}
