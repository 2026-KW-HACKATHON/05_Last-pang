import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Screen } from "../../components/Screen";
import { Card } from "../../components/Basics";
import { colors, radius } from "../../theme";

function ListItem({ icon, title, meta, danger }) {
  return (
    <View style={styles.listItem}>
      <View style={styles.listIcon}><Text style={{ fontSize: 16 }}>{icon}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.listTitle, danger && { color: colors.danger }]}>{title}</Text>
        {meta ? <Text style={styles.listMeta}>{meta}</Text> : null}
      </View>
      {!danger && <Text style={styles.chevron}>›</Text>}
    </View>
  );
}

export default function MyPageScreen() {
  return (
    <Screen>
      <Text style={styles.header}>마이페이지</Text>

      <Card style={styles.profileCard}>
        <Image source={require("../../../assets/mascot/phone.png")} style={{ width: 50, height: 50 }} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.nickname}>익명의 냥냥이</Text>
          <Text style={styles.nicknameMeta}>받은 딜 12개 · 가입 34일차</Text>
        </View>
        <Text style={styles.edit}>수정</Text>
      </Card>

      <View>
        <Text style={styles.sectionLabel}>내 설정</Text>
        <Card style={{ paddingHorizontal: 16 }}>
          <ListItem icon="🕒" title="비어있는 시간" meta="월·화·목 점심, 저녁" />
          <View style={styles.divider} />
          <ListItem icon="🍽️" title="관심 카테고리" meta="카페, 한식" />
          <View style={styles.divider} />
          <ListItem icon="📍" title="동네 반경" meta="월계1동 · 800m" />
        </Card>
      </View>

      <View>
        <Text style={styles.sectionLabel}>알림</Text>
        <Card style={{ paddingHorizontal: 16 }}>
          <View style={styles.listItem}>
            <View style={styles.listIcon}><Text style={{ fontSize: 16 }}>🔔</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>딜 알림 받기</Text>
              <Text style={styles.listMeta}>하루 최대 6건</Text>
            </View>
            <View style={styles.toggleOn}><View style={styles.toggleKnob} /></View>
          </View>
          <View style={styles.divider} />
          <ListItem icon="📜" title="받은 딜 내역" />
        </Card>
      </View>

      <Card style={{ paddingHorizontal: 16 }}>
        <ListItem icon="📄" title="이용약관 · 개인정보처리방침" />
        <View style={styles.divider} />
        <ListItem icon="🚪" title="로그아웃" danger />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 17, fontWeight: "800", color: colors.text, paddingTop: 6 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18 },
  nickname: { fontSize: 17, fontWeight: "800", color: colors.text },
  nicknameMeta: { fontSize: 12, color: colors.textSoft, fontWeight: "600", marginTop: 2 },
  edit: { fontSize: 12, fontWeight: "800", color: colors.textFaint },
  sectionLabel: { fontSize: 12, fontWeight: "800", color: colors.textFaint, marginBottom: 6, paddingHorizontal: 4 },
  listItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13 },
  listIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  listTitle: { fontSize: 13.5, fontWeight: "800", color: colors.text },
  listMeta: { fontSize: 11.5, color: colors.textSoft, fontWeight: "600" },
  chevron: { color: colors.textFaint, fontSize: 16 },
  divider: { height: 1, backgroundColor: colors.border },
  toggleOn: { width: 42, height: 24, borderRadius: 999, backgroundColor: colors.accent1, justifyContent: "center" },
  toggleKnob: { width: 18, height: 18, borderRadius: 999, backgroundColor: "#fff", marginLeft: 21 },
});
