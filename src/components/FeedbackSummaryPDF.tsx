import { formatSeconds, getReadableDate } from '@/lib/utils';
import { Comment } from '@/types';
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

export default function FeedbackSummaryPDF({
  title,
  comments,
}: {
  title: string;
  comments: Comment[];
}) {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{getReadableDate()}</Text>
        <Text style={styles.subtitle}>Feedback</Text>
        <View style={{ rowGap: 6, marginTop: 14 }}>
          <View style={{ ...styles.row, marginBottom: 8 }}>
            <Text style={{ ...styles.date, opacity: 0.4 }}>{'Comment'}</Text>
            <Text style={{ ...styles.date, opacity: 0.4 }}>{'Timestamp'}</Text>
          </View>
          {comments.map((comment, index) => {
            const { timestamp, text } = comment;
            return (
              <View
                key={index}
                style={styles.row}
              >
                <Text style={styles.text}>{text}</Text>
                <Text style={{ ...styles.text, opacity: timestamp ? 1 : 0.4 }}>
                  {timestamp ? formatSeconds(timestamp) : 'n/a'}
                </Text>
              </View>
            );
          })}
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Oswald',
  },
  text: {
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  date: {
    fontSize: 12,
    textAlign: 'center',
  },
});
