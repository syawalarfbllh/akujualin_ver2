import { useState } from "react";
import {
    AppShell,
    Burger,
    Group,
    Text,
    Avatar,
    Menu,
    UnstyledButton,
    rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconLogout,
    IconDashboard,
    IconSettings,
    IconUser,
    IconBuildingStore,
} from "@tabler/icons-react";
import { Link, router, usePage } from "@inertiajs/react";

export default function AuthenticatedLayout({ user, header, children }) {
    const [opened, { toggle }] = useDisclosure();
    const { url } = usePage();

    // --- PERBAIKAN DI SINI ---
    // Kita tambahkan properti 'isGlobal'
    // isGlobal: false -> akan ditambah prefix (staff.dashboard)
    // isGlobal: true  -> tidak ditambah prefix (profile.edit)
    const menuItems = [
        {
            link: "dashboard",
            label: "Dashboard",
            icon: IconDashboard,
            isGlobal: false, // Ini butuh prefix (staff.dashboard)
        },
        {
            link: "profile.edit",
            label: "Profile",
            icon: IconUser,
            isGlobal: true, // Ini route global (profile.edit)
        },
    ];

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            {/* --- HEADER --- */}
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <IconBuildingStore size={30} color="#4338ca" />
                        <Text fw={700} size="lg" visibleFrom="xs">
                            Akujualin
                        </Text>
                    </Group>

                    {/* User Dropdown */}
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <UnstyledButton>
                                <Group gap={7}>
                                    <Avatar
                                        src={null}
                                        alt={user.name}
                                        radius="xl"
                                        color="indigo"
                                    >
                                        {user.name.charAt(0)}
                                    </Avatar>
                                    <div style={{ flex: 1 }}>
                                        <Text
                                            size="sm"
                                            fw={500}
                                            visibleFrom="sm"
                                        >
                                            {user.name}
                                        </Text>
                                        <Text
                                            c="dimmed"
                                            size="xs"
                                            visibleFrom="sm"
                                        >
                                            {user.role === "staff_umkm"
                                                ? "Seller/UMKM"
                                                : "Mahasiswa"}
                                        </Text>
                                    </div>
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Akun</Menu.Label>
                            {/* Route Profile Dropdown (Sudah Benar) */}
                            <Menu.Item
                                leftSection={
                                    <IconSettings
                                        style={{
                                            width: rem(14),
                                            height: rem(14),
                                        }}
                                    />
                                }
                                component={Link}
                                href={route("profile.edit")}
                            >
                                Pengaturan
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Item
                                color="red"
                                leftSection={
                                    <IconLogout
                                        style={{
                                            width: rem(14),
                                            height: rem(14),
                                        }}
                                    />
                                }
                                onClick={() => router.post(route("logout"))}
                            >
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </AppShell.Header>

            {/* --- SIDEBAR --- */}
            <AppShell.Navbar p="md">
                <Text size="xs" fw={500} c="dimmed" mb="sm">
                    MENU UTAMA
                </Text>
                {menuItems.map((item) => {
                    const isActive = url.includes(item.link.replace(".", "/"));

                    // --- LOGIKA PENENTUAN ROUTE YANG DIPERBAIKI ---
                    let routeName;

                    if (item.isGlobal) {
                        // Jika global, pakai nama aslinya (profile.edit)
                        routeName = item.link;
                    } else {
                        // Jika tidak global, tambahkan prefix role (staff.dashboard)
                        const prefix =
                            user.role === "staff_umkm"
                                ? "staff."
                                : "mahasiswa.";
                        routeName = prefix + item.link;
                    }

                    return (
                        <UnstyledButton
                            key={item.label}
                            component={Link}
                            href={route(routeName)} // Gunakan routeName yang sudah diproses
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                color: isActive ? "#4338ca" : "black",
                                backgroundColor: isActive
                                    ? "#eef2ff"
                                    : "transparent",
                                marginBottom: "5px",
                                textDecoration: "none",
                            }}
                        >
                            <Group>
                                <item.icon size={20} stroke={1.5} />
                                <Text size="sm">{item.label}</Text>
                            </Group>
                        </UnstyledButton>
                    );
                })}
            </AppShell.Navbar>

            {/* --- MAIN CONTENT --- */}
            <AppShell.Main bg="gray.0">
                {header && <div style={{ marginBottom: "20px" }}>{header}</div>}
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
