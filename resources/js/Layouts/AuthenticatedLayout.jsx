import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Box,
    NavLink,
    Stack,
    Text,
    Group,
    ThemeIcon,
    Divider,
    ScrollArea,
} from "@mantine/core";
import {
    IconDashboard,
    IconUsers,
    IconBuildingStore,
    IconClipboardList,
    IconShoppingBag,
    IconHistory,
    IconChartBar,
    IconSettings,
} from "@tabler/icons-react";

export default function AuthenticatedLayout({ user, children }) {
    const { url } = usePage();

    // DEFINISI MENU BERDASARKAN ROLE
    const menuConfig = {
        admin: [
            {
                label: "Dashboard",
                icon: IconDashboard,
                route: "admin.dashboard",
            },
            {
                label: "Kelola User",
                icon: IconUsers,
                route: "admin.users.index",
            },
            {
                label: "Monitor Produk",
                icon: IconBuildingStore,
                route: "admin.products.index",
            },
            {
                label: "Monitor Klaim",
                icon: IconChartBar,
                route: "admin.claims.index",
            },
        ],
        staff_umkm: [
            {
                label: "Dashboard",
                icon: IconDashboard,
                route: "staff.dashboard",
            },
            {
                label: "Produk Saya",
                icon: IconShoppingBag,
                route: "staff.product.index",
            },
            {
                label: "Validasi Klaim",
                icon: IconClipboardList,
                route: "staff.commission.index",
            },
        ],
        mahasiswa: [
            {
                label: "Dashboard",
                icon: IconDashboard,
                route: "mahasiswa.dashboard",
            },
            {
                label: "Katalog Produk",
                icon: IconShoppingBag,
                route: "mahasiswa.katalog",
            },
            {
                label: "Riwayat Klaim",
                icon: IconHistory,
                route: "mahasiswa.claim.history",
            },
        ],
    };

    const activeMenu = menuConfig[user.role] || [];

    return (
        <Box
            style={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
            }}
        >
            {/* SIDEBAR */}
            <Box
                w={260}
                p="md"
                style={{
                    borderRight: "1px solid #e9ecef",
                    backgroundColor: "white",
                    position: "fixed",
                    height: "100vh",
                }}
            >
                <Stack justify="space-between" h="100%">
                    <Box>
                        <Group mb="xl" px="sm">
                            <ThemeIcon
                                size="lg"
                                variant="gradient"
                                gradient={{ from: "blue", to: "cyan" }}
                            >
                                <IconShoppingBag size={20} />
                            </ThemeIcon>
                            <Text
                                fw={800}
                                size="lg"
                                variant="gradient"
                                gradient={{ from: "blue", to: "cyan" }}
                            >
                                AKUJUALIN
                            </Text>
                        </Group>

                        <Text
                            size="xs"
                            fw={700}
                            c="dimmed"
                            mb="xs"
                            px="sm"
                            tt="uppercase"
                        >
                            Menu Utama
                        </Text>

                        <Stack gap={4}>
                            {activeMenu.map((item) => (
                                <NavLink
                                    key={item.label}
                                    component={Link}
                                    href={route(item.route)}
                                    label={item.label}
                                    leftSection={
                                        <item.icon size={18} stroke={1.5} />
                                    }
                                    active={url.startsWith(
                                        route(item.route, {}, false),
                                    )}
                                    variant="light"
                                    color="blue"
                                    styles={{
                                        root: { borderRadius: "8px" },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Box>
                        <Divider mb="sm" />
                        <NavLink
                            component={Link}
                            href={route("profile.edit")}
                            label="Pengaturan Profil"
                            leftSection={<IconSettings size={18} />}
                            active={url === "/profile"}
                            mb={4}
                        />
                        <NavLink
                            component={Link}
                            method="post"
                            href={route("logout")}
                            label="Keluar"
                            leftSection={<IconHistory size={18} />}
                            color="red"
                        />
                    </Box>
                </Stack>
            </Box>

            {/* MAIN CONTENT */}
            <Box style={{ flex: 1, marginLeft: 260 }} p="xl">
                {children}
            </Box>
        </Box>
    );
}
