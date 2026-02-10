import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Send, ArrowLeft, Image, Phone, Video } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

function Negotiation() {
  const { livestockId, receiverId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [livestock, setLivestock] = useState(null);
  const [receiverName, setReceiverName] = useState('Loading...');

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

