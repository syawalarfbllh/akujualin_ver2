import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    AppShell,
    Burger,
    Group,
    Text,
    NavLink,
    Stack,
    ThemeIcon,
    ScrollArea,
    Avatar,
    Box,
    Menu,
    UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconDashboard,
    IconUsers,
    IconBuildingStore,
    IconClipboardList,
    IconShoppingBag,
    IconHistory,
    IconVideo,
    IconLogout,
    IconChevronRight,
    IconUser,
    IconChevronDown,
    IconWallet,
    IconTrophy,
    IconSearch,
    IconPlus,
    IconSchool,
} from "@tabler/icons-react";

export default function AuthenticatedLayout({ user, children }) {
    const { url } = usePage();
    const [opened, { toggle, close }] = useDisclosure();

    // --- KONFIGURASI MENU ---
    const menuConfig = {
        // 1. MENU ADMIN
        admin: [
            {
                group: "Overview",
                items: [
                    {
                        label: "Dashboard",
                        icon: IconDashboard,
                        route: "admin.dashboard",
                    },
                ],
            },
            {
                group: "Supervisi Bisnis", // Update Bagian Ini
                items: [
                    {
                        label: "Performa Seller",
                        icon: IconBuildingStore,
                        route: "admin.monitor.staff", // Sesuai routes/web.php
                    },
                    {
                        label: "Kinerja Mahasiswa",
                        icon: IconSchool,
                        route: "admin.monitor.mahasiswa", // Sesuai routes/web.php
                    },
                    {
                        label: "Top Leaderboard",
                        icon: IconTrophy,
                        route: "admin.monitor.leaderboard", // Sesuai routes/web.php
                    },
                ],
            },
            {
                group: "Validasi & Keuangan",
                items: [
                    {
                        label: "Validasi Produk",
                        icon: IconClipboardList,
                        route: "admin.products.index",
                    },
                    {
                        label: "Pencairan Komisi",
                        icon: IconWallet,
                        route: "admin.claims.index",
                    },
                ],
            },
            {
                group: "Sistem",
                items: [
                    {
                        label: "Manajemen User",
                        icon: IconUsers,
                        route: "admin.users.index",
                    },
                ],
            },
        ],

        // 2. MENU STAFF UMKM
        staff_umkm: [
            {
                group: "Menu Utama",
                items: [
                    {
                        label: "Dashboard",
                        icon: IconDashboard,
                        route: "staff.dashboard",
                    },
                ],
            },
            {
                group: "Manajemen Produk",
                items: [
                    {
                        label: "Katalog Produk",
                        icon: IconShoppingBag,
                        route: "staff.product.index",
                    },
                    {
                        label: "Tambah Produk",
                        icon: IconPlus,
                        route: "staff.product.create",
                    },
                    {
                        label: "Gudang Konten",
                        icon: IconVideo,
                        route: "staff.content.index",
                    },
                ],
            },
            {
                group: "Affiliate & Komisi",
                items: [
                    {
                        label: "Validasi Komisi",
                        icon: IconClipboardList,
                        route: "staff.commission.index",
                    },
                    {
                        label: "Cari Affiliator",
                        icon: IconSearch,
                        route: "staff.affiliate.index",
                    },
                    {
                        label: "Leaderboard",
                        icon: IconTrophy,
                        route: "staff.affiliate.leaderboard",
                    },
                ],
            },
        ],

        // 3. MENU MAHASISWA
        mahasiswa: [
            {
                group: "Menu Utama",
                items: [
                    {
                        label: "Dashboard",
                        icon: IconDashboard,
                        route: "mahasiswa.dashboard",
                    },
                ],
            },
            {
                group: "Eksplorasi Cuan",
                items: [
                    {
                        label: "Katalog Produk",
                        icon: IconShoppingBag,
                        route: "mahasiswa.katalog",
                    },
                    {
                        label: "Katalog Konten",
                        icon: IconVideo,
                        route: "mahasiswa.content.library",
                    },
                ],
            },
            {
                group: "Dompet Saya",
                items: [
                    {
                        label: "Riwayat Klaim",
                        icon: IconHistory,
                        route: "mahasiswa.claim.history",
                    },
                ],
            },
        ],
    };

    // Ambil menu berdasarkan role user yang sedang login
    const activeMenu = menuConfig[user.role] || [];

    // --- HELPER FUNCTIONS ---

    // Cek apakah route aktif menggunakan Ziggy route().current()
    // Lebih akurat daripada string matching manual
    const isRouteActive = (routeKey) => {
        try {
            // Jika routeKey ada wildcard (misal 'admin.products.*')
            return route().current(routeKey);
        } catch (e) {
            return false;
        }
    };

    // Safe route wrapper agar tidak error halaman putih jika route belum dibuat
    const safeRoute = (name) => {
        try {
            return route(name);
        } catch (e) {
            console.warn(`Route [${name}] not found in Ziggy list.`);
            return "#";
        }
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 260,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            {/* HEADER */}
            <AppShell.Header
                bg="white"
                style={{ borderBottom: "1px solid #e9ecef" }}
            >
                <Group h="100%" px="xl" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Group gap="xs">
                            <ThemeIcon
                                size="lg"
                                variant="gradient"
                                gradient={{ from: "blue", to: "cyan" }}
                                radius="md"
                            >
                                <IconShoppingBag size={20} />
                            </ThemeIcon>
                            <Text
                                fw={900}
                                size="xl"
                                lts="-1px"
                                variant="gradient"
                                gradient={{ from: "blue", to: "cyan" }}
                                visibleFrom="xs"
                            >
                                AKUJUALIN
                            </Text>
                        </Group>
                    </Group>

                    {/* USER PROFILE DROPDOWN */}
                    <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        transitionProps={{ transition: "pop-top-right" }}
                        withArrow
                    >
                        <Menu.Target>
                            <UnstyledButton
                                style={{
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    transition: "background-color 0.2s",
                                }}
                            >
                                <Group gap="xs">
                                    <Avatar
                                        src={user.avatar}
                                        radius="xl"
                                        size="sm"
                                        color="blue"
                                        name={user.name}
                                    >
                                        {user.name.charAt(0)}
                                    </Avatar>
                                    <Box style={{ flex: 1 }} visibleFrom="sm">
                                        <Text size="sm" fw={700} lh={1}>
                                            {user.name}
                                        </Text>
                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            tt="capitalize"
                                        >
                                            {user.role.replace("_", " ")}
                                        </Text>
                                    </Box>
                                    <IconChevronDown
                                        size={14}
                                        stroke={1.5}
                                        color="gray"
                                    />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Akun Saya</Menu.Label>
                            <Menu.Item
                                component={Link}
                                href={route("profile.edit")}
                                leftSection={<IconUser size={14} />}
                            >
                                Profil Saya
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Item
                                component={Link}
                                method="post"
                                as="button"
                                href={route("logout")}
                                color="red"
                                leftSection={<IconLogout size={14} />}
                            >
                                Keluar
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </AppShell.Header>

            {/* SIDEBAR NAVIGATION */}
            <AppShell.Navbar p="md" bg="white">
                <AppShell.Section grow component={ScrollArea}>
                    {activeMenu.map((section, idx) => (
                        <Box key={idx} mb="lg">
                            {/* Group Title */}
                            {section.group && (
                                <Text
                                    size="xs"
                                    fw={700}
                                    c="dimmed"
                                    mb="xs"
                                    tt="uppercase"
                                    ls={0.5}
                                >
                                    {section.group}
                                </Text>
                            )}

                            {/* Menu Items */}
                            <Stack gap={4}>
                                {section.items.map((item) => {
                                    const active = isRouteActive(item.route);

                                    return (
                                        <NavLink
                                            key={item.label}
                                            component={Link}
                                            href={safeRoute(item.route)}
                                            label={
                                                <Text
                                                    size="sm"
                                                    fw={active ? 700 : 500}
                                                >
                                                    {item.label}
                                                </Text>
                                            }
                                            onClick={() => {
                                                if (window.innerWidth < 768)
                                                    close();
                                            }}
                                            leftSection={
                                                <item.icon
                                                    size={20}
                                                    stroke={1.5}
                                                />
                                            }
                                            rightSection={
                                                active && (
                                                    <IconChevronRight
                                                        size={14}
                                                        stroke={1.5}
                                                    />
                                                )
                                            }
                                            active={active}
                                            variant="light"
                                            color="blue"
                                            styles={{
                                                root: {
                                                    borderRadius: "8px",
                                                    marginBottom: "2px",
                                                },
                                            }}
                                        />
                                    );
                                })}
                            </Stack>
                        </Box>
                    ))}
                </AppShell.Section>
            </AppShell.Navbar>

            {/* MAIN CONTENT AREA */}
            <AppShell.Main bg="gray.0">
                <Box
                    p={{ base: "xs", sm: "md" }}
                    style={{ minHeight: "100vh" }}
                >
                    {children}
                </Box>
            </AppShell.Main>
        </AppShell>
    );
}
