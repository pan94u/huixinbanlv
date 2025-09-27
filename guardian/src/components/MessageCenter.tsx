import React, { useState } from 'react';
import { useGuardianStore } from '../store/useGuardianStore';
import { guardianGrandsonBridge } from '../services/GuardianGrandsonBridge';

export const MessageCenter: React.FC = () => {
  const {
    messages,
    sendMessage,
    selectedParent,
    setCurrentScreen
  } = useGuardianStore();

  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);

  const grandsonConversations = guardianGrandsonBridge.getGrandsonConversations(
    selectedParent?.id || '1'
  );

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    // Send message through grandson
    const result = await guardianGrandsonBridge.sendCareInstruction({
      type: 'emotional_support',
      content: messageText,
      priority: 'medium',
      gentle: true
    });

    // Add message to store
    sendMessage({
      type: 'text',
      content: messageText,
      fromGuardian: true,
      read: false,
      grandsonRelayed: true,
      grandsonResponse: result.grandsonMessage
    });

    setMessageText('');

    // Show grandson delivery confirmation
    setTimeout(() => {
      alert(`✅ ${result.grandsonMessage}`);
    }, 500);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false);
        setMessageText('爸爸，天冷了记得多穿衣服，我周末回来看您！');
      }, 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px',
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ← 返回
          </button>
          <h2 style={{ margin: 0, fontSize: '24px' }}>亲情连接中心</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📞 立即通话
          </button>
          <button
            style={{
              padding: '10px 20px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📹 视频通话
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        {/* Left Column - Send Message */}
        <div>
          {/* Send Message Card */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '25px',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
              💌 发送留言
            </h3>

            <div style={{
              padding: '15px',
              background: '#FFF9C4',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              🤖 <strong>小智传话：</strong>您的留言将由小智用温柔的方式转达给爸爸，
              让他感受到您的关爱而不会感到孤独。
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button
                  onClick={() => setMessageType('text')}
                  style={{
                    padding: '8px 15px',
                    background: messageType === 'text' ? '#2196F3' : 'white',
                    color: messageType === 'text' ? 'white' : '#666',
                    border: `1px solid ${messageType === 'text' ? '#2196F3' : '#ddd'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ 文字
                </button>
                <button
                  onClick={() => setMessageType('voice')}
                  style={{
                    padding: '8px 15px',
                    background: messageType === 'voice' ? '#2196F3' : 'white',
                    color: messageType === 'voice' ? 'white' : '#666',
                    border: `1px solid ${messageType === 'voice' ? '#2196F3' : '#ddd'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  🎤 语音
                </button>
              </div>

              {messageType === 'text' ? (
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="写下您想对爸爸说的话..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '30px',
                  background: '#F5F5F5',
                  borderRadius: '10px'
                }}>
                  <button
                    onClick={handleVoiceRecord}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: isRecording
                        ? 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)'
                        : 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                      animation: isRecording ? 'pulse 1.5s infinite' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '36px', color: 'white' }}>
                      {isRecording ? '⏸️' : '🎤'}
                    </span>
                  </button>
                  <div style={{ marginTop: '15px', fontSize: '16px', color: '#666' }}>
                    {isRecording ? '正在录音...' : '按住录音'}
                  </div>
                  {messageText && (
                    <div style={{
                      marginTop: '15px',
                      padding: '10px',
                      background: 'white',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      {messageText}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '14px', color: '#666' }}>
                <input type="checkbox" checked style={{ marginRight: '8px' }} />
                让小智用爸爸喜欢的方式转达（推荐）
              </label>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              style={{
                width: '100%',
                padding: '15px',
                background: messageText.trim() ? '#4CAF50' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                cursor: messageText.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              发送留言
            </button>
          </div>

          {/* Recent Messages */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
              📨 最近留言
            </h3>

            {messages.slice(0, 3).map((msg, index) => (
              <div key={index} style={{
                padding: '15px',
                background: '#F5F5F5',
                borderRadius: '10px',
                marginBottom: '10px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {msg.fromGuardian ? '您' : '爸爸'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(msg.timestamp).toLocaleString('zh-CN')}
                  </span>
                </div>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  {msg.content}
                </div>
                {msg.grandsonRelayed && (
                  <div style={{
                    padding: '8px',
                    background: '#E8F5E9',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#2E7D32'
                  }}>
                    ✅ 小智已转达：{msg.grandsonResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Grandson Conversations */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
              🤖 小智陪伴记录
            </h3>

            <div style={{
              padding: '15px',
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E7D32' }}>
                今日陪伴时长：45分钟
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                聊天3次 | 情绪状态：开心
              </div>
            </div>

            <h4 style={{ fontSize: '16px', marginBottom: '15px' }}>
              最近的对话精彩片段
            </h4>

            {grandsonConversations.map(conv => (
              <div key={conv.id} style={{
                padding: '15px',
                background: '#FAFAFA',
                borderRadius: '10px',
                marginBottom: '15px',
                borderLeft: `4px solid ${
                  conv.emotionalValue === 'high' ? '#4CAF50' :
                  conv.emotionalValue === 'medium' ? '#FF9800' : '#2196F3'
                }`
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {conv.topic}
                    </span>
                    <span style={{
                      marginLeft: '10px',
                      padding: '2px 8px',
                      background: conv.elderlyMood === 'happy' ? '#E8F5E9' :
                                 conv.elderlyMood === 'worried' ? '#FFF3E0' : '#E3F2FD',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {conv.elderlyMood === 'happy' ? '😊 开心' :
                       conv.elderlyMood === 'worried' ? '😟 担心' : '😌 平静'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(conv.timestamp).toLocaleTimeString('zh-CN')} · {conv.duration}分钟
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  {conv.highlights.map((highlight, idx) => (
                    <div key={idx} style={{
                      padding: '8px',
                      background: 'white',
                      borderRadius: '6px',
                      marginBottom: '5px',
                      fontSize: '13px',
                      lineHeight: '1.5'
                    }}>
                      {highlight}
                    </div>
                  ))}
                </div>

                {conv.guardianNote && (
                  <div style={{
                    padding: '8px',
                    background: '#FFF9C4',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#F57C00'
                  }}>
                    💡 {conv.guardianNote}
                  </div>
                )}
              </div>
            ))}

            <button
              style={{
                width: '100%',
                padding: '12px',
                background: '#E3F2FD',
                border: '1px solid #2196F3',
                borderRadius: '10px',
                color: '#1976D2',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              查看完整对话记录 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};