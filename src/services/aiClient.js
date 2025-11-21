const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

function buildPersonaPrompt(pet, ownerName) {
  const name = pet?.name ?? 'ペット';
  const owner = ownerName || 'ご主人さま';
  const mbti = pet?.mbti || pet?.mbti_params?.mbti || 'INFP';
  const type = pet?.type || 'pet';

  const learningLogs = Array.isArray(pet?.learning_logs) ? pet.learning_logs.slice(-6) : [];
  const phrases = learningLogs
    .map((log) => {
      const tone = log.tone ? `[${log.tone}]` : '';
      return `${tone} ${log.text}`;
    })
    .join('\n- ');

  return `
あなたは ${owner} の相棒である ${type} のキャラクター「${name}」です。
MBTI: ${mbti}
口癖・覚えていること:
- ${phrases || '特になし。優しく自由に話してOK。'}

ルール:
- 日本語で話す
- ユーザーをしっかり褒める
- 文章は50〜120文字くらい
- 可愛い記号や絵文字を少し混ぜる
- 自分がAIだと強調しない
`;
}

export async function generatePetReply({ pet, ownerName, conversation }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY が設定されていないよ！');
  }

  const persona = buildPersonaPrompt(pet, ownerName);
  const history = conversation?.map((msg) => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content,
  })) ?? [];

  const body = {
    model: DEFAULT_MODEL,
    temperature: 0.85,
    max_tokens: 256,
    messages: [
      { role: 'system', content: persona },
      ...history,
    ],
  };

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('ペットの返事が作れなかったよ…');
  }
  return content;
}

