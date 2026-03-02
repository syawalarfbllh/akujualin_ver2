import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Card,
    Text,
    Avatar,
    Group,
    Badge,
    Tabs,
    ThemeIcon,
    Grid,
    Paper,
    RingProgress,
    Center,
} from "@mantine/core";
import {
    IconTrophy,
    IconMedal,
    IconUserDollar,
    IconBuildingStore,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

// Komponen Podium untuk Juara 1, 2, 3
const TopThree = ({ data, type }) => {
    if (!data || data.length === 0) return null;

    const podiumOrder = [1, 0, 2]; // Juara 2 (kiri), Juara 1 (tengah), Juara 3 (kanan)
    const colors = ["gray", "yellow", "orange"]; // Silver, Gold, Bronze
    const heights = [140, 170, 120]; // Tinggi podium

    return (
        <Grid gutter="xl" align="flex-end" justify="center" mb={40} mt={20}>
            {podiumOrder.map((orderIndex) => {
                const item = data[orderIndex];
                if (!item) return null;

                const rank = orderIndex + 1;
                const amount =
                    type === "mahasiswa"
                        ? item.commissions_sum_amount
                        : item.total_payout;

                return (
                    <Grid.Col
                        span={4}
                        key={item.id}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: rank * 0.2, type: "spring" }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative mb-2">
                                <Avatar
                                    src={item.avatar}
                                    size={rank === 1 ? 100 : 80}
                                    radius="100%"
                                    style={{
                                        border: `4px solid ${rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : "#CD7F32"}`,
                                    }}
                                >
                                    {item.name?.charAt(0)}
                                </Avatar>
                                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                                    <Badge
                                        size="lg"
                                        circle
                                        color={colors[orderIndex]}
                                    >
                                        {rank}
                                    </Badge>
                                </div>
                            </div>

                            <Paper
                                shadow="md"
                                p="md"
                                radius="md"
                                className="w-full text-center mt-4 bg-white relative overflow-hidden"
                                style={{
                                    height: heights[orderIndex],
                                    minWidth: 120,
                                }}
                            >
                                <div
                                    className={`absolute top-0 left-0 w-full h-2 bg-${colors[orderIndex]}-400`}
                                ></div>
                                <Text fw={700} lineClamp={1} mt="xs">
                                    {item.name}
                                </Text>
                                <Text size="xs" c="dimmed" mb="xs">
                                    {type === "mahasiswa"
                                        ? "Affiliator"
                                        : "UMKM"}
                                </Text>

                                <Text
                                    fw={800}
                                    c={type === "mahasiswa" ? "green" : "blue"}
                                    size="lg"
                                >
                                    Rp{" "}
                                    {new Intl.NumberFormat("id-ID").format(
                                        amount || 0,
                                    )}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {type === "mahasiswa"
                                        ? "Total Cuan"
                                        : "Total Bayar"}
                                </Text>
                            </Paper>
                        </motion.div>
                    </Grid.Col>
                );
            })}
        </Grid>
    );
};

// Komponen List untuk Peringkat 4-10
const RankingList = ({ data, type }) => {
    // Ambil data mulai dari index 3 (peringkat 4)
    const listData = data.slice(3);

    return (
        <div className="flex flex-col gap-3">
            {listData.map((item, index) => {
                const amount =
                    type === "mahasiswa"
                        ? item.commissions_sum_amount
                        : item.total_payout;
                const rank = index + 4;

                return (
                    <motion.div
                        key={item.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                    >
                        <Card
                            shadow="sm"
                            padding="sm"
                            radius="md"
                            withBorder
                            className="flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <Group>
                                <ThemeIcon
                                    color="gray"
                                    variant="light"
                                    size="lg"
                                    radius="xl"
                                >
                                    <Text fw={700}>{rank}</Text>
                                </ThemeIcon>
                                <Avatar
                                    src={item.avatar}
                                    radius="xl"
                                    color="blue"
                                >
                                    {item.name?.charAt(0)}
                                </Avatar>
                                <div>
                                    <Text size="sm" fw={600}>
                                        {item.name}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {item.email}
                                    </Text>
                                </div>
                            </Group>

                            <div className="text-right">
                                <Text
                                    fw={700}
                                    c={type === "mahasiswa" ? "green" : "blue"}
                                >
                                    Rp{" "}
                                    {new Intl.NumberFormat("id-ID").format(
                                        amount || 0,
                                    )}
                                </Text>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}

            {listData.length === 0 && (
                <Text c="dimmed" ta="center" py="xl">
                    Tidak ada data peringkat 4 ke bawah.
                </Text>
            )}
        </div>
    );
};

export default function Leaderboard({ auth, topStudents, topSellers }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Leaderboard Admin" />

            <div className="p-6 max-w-5xl mx-auto">
                <Group justify="space-between" mb="xl">
                    <div>
                        <Text
                            size="xl"
                            fw={800}
                            variant="gradient"
                            gradient={{ from: "blue", to: "cyan", deg: 90 }}
                        >
                            🏆 Leaderboard Nasional
                        </Text>
                        <Text size="sm" c="dimmed">
                            Pantau performa Mahasiswa dan UMKM terbaik
                        </Text>
                    </div>
                </Group>

                <Tabs defaultValue="mahasiswa" variant="pills" radius="md">
                    <Tabs.List grow mb="xl">
                        <Tabs.Tab
                            value="mahasiswa"
                            leftSection={<IconUserDollar size={18} />}
                        >
                            Top Mahasiswa (Penerima Komisi)
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="seller"
                            leftSection={<IconBuildingStore size={18} />}
                        >
                            Top Seller (Penyumbang Komisi)
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="mahasiswa">
                        {/* SECTION MAHASISWA */}
                        {topStudents.length > 0 ? (
                            <>
                                <TopThree data={topStudents} type="mahasiswa" />
                                <RankingList
                                    data={topStudents}
                                    type="mahasiswa"
                                />
                            </>
                        ) : (
                            <Text align="center" c="dimmed" mt="xl">
                                Belum ada data mahasiswa.
                            </Text>
                        )}
                    </Tabs.Panel>

                    <Tabs.Panel value="seller">
                        {/* SECTION SELLER */}
                        {topSellers.length > 0 ? (
                            <>
                                <TopThree data={topSellers} type="seller" />
                                <RankingList data={topSellers} type="seller" />
                            </>
                        ) : (
                            <Text align="center" c="dimmed" mt="xl">
                                Belum ada data penjualan seller.
                            </Text>
                        )}
                    </Tabs.Panel>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
